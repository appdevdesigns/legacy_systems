/**
* LHRISAssignment.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    tableName:"hris_assignment",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    migrate:'safe',  // don't update the tables!



  connection:"legacy_hris",



    attributes: {

        'id' : {
            columnName: 'assignment_id',
            type : "integer",
            size : 11,
            primaryKey : true,
            autoIncrement : true
        }, 

        assignment_guid : {
            type : "string",
            size : 45
        }, 

        ren_id : {
            model:'LHRISRen'
        }, 

        team_id : {
            model: 'LHRISAssignTeam'
        }, 

        position_id : {
            model: 'LHRISAssignPosition'
        }, 

        assignment_startdate : {
            type : "date",
            defaultsTo : "1000-01-01",
            required:false
        }, 

        assignment_enddate : {
            type : "date",
            defaultsTo : "1000-01-01",
            required:false
        }, 

        assignment_isprimary : {
            type : "integer",
            size : 1,
            defaultsTo : "0"
        }, 
        
        "xref_loc_assign": {
            collection: "LHRISXRefLocationAssignment",
            via: "assignment_id"
        }


    },
    
    
    ////////////////////////////
    // Model class methods
    ////////////////////////////
    
    /**
     * Fetches a list of primary assignments for people in the given person's
     * family. The assignment labels will be in the person's preferred language.
     *
     * @param {int} renID
     * @return {Promise}
     *      Resolves with an array
     */
    familyPrimaryAssignments: function(renID) {
        return new Promise((resolve, reject) => {
            var results = [];
            var langCode = 'en';
            
            async.series([
            
                (next) => {
                    // Find preferred language
                    LHRISAssignment.query(`
                        
                        SELECT
                            language_i18n
                        FROM
                            hris_ren_data AS r
                            JOIN hris_language_data AS lang
                                ON r.ren_preferredlang = lang.language_id
                        WHERE
                            r.ren_id = ?
                            
                    `, [renID], (err, list) => {
                        if (err) next(err);
                        else if (!list || !list[0]) {
                            next();
                        }
                        else {
                            var shortCode = String(list[0].language_i18n).substring(0,2).toLowerCase();
                            switch (shortCode) {
                                default:
                                case 'en':
                                    langCode = 'en';
                                    break;
                                case 'ko':
                                    langCode = 'ko';
                                    break;
                                case 'zh':
                                    langCode = 'zh-Hans';
                                    break;
                            }
                            next();
                        }
                    });
                },
                
                (next) => {
                    // Find primary assignments
                    LHRISAssignment.query(`
                    
                        SELECT
                            familyRen.*,
                            a.*, 
                            tt.team_label,
                            ld.location_region, lt.location_label, lt.ancestry_label,
                            mt.mcc_label,
                            acc.account_number, acc.country_id AS account_country_id,
                            ct.country_label AS account_country_label
                            
                        FROM
                            -- My family members
                            hris_ren_data AS myRen
                            JOIN hris_ren_data AS familyRen
                                ON myRen.family_id = familyRen.family_id
                                AND myRen.ren_id = ?
                                
                            -- Family members with primary assignments
                            JOIN hris_assignment AS a
                                ON a.ren_id = familyRen.ren_id
                                AND a.assignment_isprimary
                            
                            -- Assignment team
                            JOIN hris_assign_team_data AS td
                                ON a.team_id = td.team_id
                            JOIN hris_assign_team_trans AS tt
                                ON a.team_id = tt.team_id
                                AND tt.language_code = ?
                            
                            -- Team location
                            JOIN hris_xref_team_location AS xtl
                                ON a.team_id = xtl.team_id
                            JOIN hris_assign_location_data AS ld
                                ON xtl.location_id = ld.location_id
                            JOIN hris_assign_location_trans AS lt
                                ON xtl.location_id = lt.location_id
                                AND lt.language_code = ?
                                
                            -- Team MCC
                            JOIN hris_assign_mcc_data AS md
                                ON td.mcc_id = md.mcc_id
                            JOIN hris_assign_mcc_trans AS mt
                                ON td.mcc_id = mt.mcc_id
                                AND mt.language_code = ?
                            
                            -- Worker
                            JOIN hris_worker AS w
                                ON familyRen.ren_id = w.ren_id
                            
                            -- Account
                            LEFT JOIN hris_account AS acc
                                ON w.account_id = acc.account_id
                            LEFT JOIN hris_country_trans AS ct
                                ON acc.country_id = ct.country_id
                                AND ct.language_code = ?
                            
                    `, 
                    [renID, langCode, langCode, langCode, langCode], 
                    (err, list) => {
                        if (err) next(err);
                        else {
                            results = list;
                            next();
                        }
                    });
                }
                
            ], (err) => {
                if (err) reject(err);
                else {
                    resolve(results);
                }
            });
        });
    }
};


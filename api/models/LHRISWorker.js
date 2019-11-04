/**
* LHRISWorker.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var AD = require('ad-utils');

module.exports = {

    tableName:"hris_worker",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    migrate:'safe',  // don't update the tables!


    connection:"legacy_hris",


    attributes: {

        'id' : {
            columnName: 'worker_id',
            type : "integer",
            size : 11,
            primaryKey : true,
            autoIncrement : true
        }, 

        worker_guid : {
            type : "string",
            size : 45
        }, 

        ren_id : {
            model: 'LHRISRen'
        }, 
        
        worker_enrolledasstudent: {
            type: 'integer',
            size: 1,
            defaultsTo: 0
        },
        
        sendingregion_id: {
            model: 'LHRISSendingRegion'
        },
        
        worker_acceptancedate: {
            type: 'date'
        },
        
        worker_datejoinedstaff: {
            type: 'date'
        },
        
        worker_terminationdate: {
            type: 'date'
        },
        
        worker_motherattitude: {
            model: 'LHRISAttitude'
        },
        
        worker_fatherattitude: {
            model: 'LHRISAttitude'
        },
        
        worker_isenrolledfortax: {
            type: 'integer',
            size: 1,
            defaultsTo: 0
        },
        
        worker_hukoulocation: {
            type: 'string',
            size: 45
        },
        
        worker_governmentid: {
            type: 'string',
            size: 45
        },
        
        worker_vocation: {
            type: 'string',
            size: 45
        },
        
        statustype_id: {
            model: 'LHRISWorkerStatusType'
        },
        
        paysys_id: {
            model: 'LHRISWorkerPaysys'
        },
        
        fundingsource_id: {
            model: 'LHRISFundingSource'
        },

        account_id : {
            model: 'LHRISAccount'
        },
        
        worker_tenuremodifier: {
            type: 'integer',
            size: 5,
            defaultsTo: 0
        },
        
        statusHistory: {
            collection: 'LHRISWorkerStatusHistory',
            via: 'worker_id'
        }


    },
    
    ////////////////////////////
    // Model class methods
    ////////////////////////////
    
    /**
     * Used by workersByAccount().
     *
     * [
     *     {
     *          "Name": <string>,
     *          "Account Number": <string>,
     *          "Phone": <string>,
     *          "Email": <string>,
     *          "location_id": <int>
     *     },
     *     ...
     * ]
     *
     * @param string countryCode
     * @return Deferred
     */
    findWorkersInfo: function(countryCode) {
        var dfd = AD.sal.Deferred();
        countryCode = countryCode.replace(/\W/g, '') // alphanumeric only
                        || '%'; // default is all countries
        
        LHRISWorker.query("\
            SELECT \
                CONCAT(r.ren_surname, ', ', r.ren_givenname) AS 'Name', \
                a.account_number AS 'Account Number', \
                GROUP_CONCAT( DISTINCT \
                    p.phone_number, \
                    ' (', \
                    SUBSTRING(pt.phonetype_label, 1, 1), \
                    ')' \
                    SEPARATOR ', ' \
                ) AS 'Phone', \
                GROUP_CONCAT( DISTINCT \
                    e.email_address \
                    SEPARATOR ', ' \
                ) AS 'Email', \
                r.ren_isfamilypoc AS 'isPOC', \
                lt.location_id \
            \
            FROM \
                hris_country_data cd \
                JOIN hris_account a \
                    ON cd.country_code LIKE ? \
                    AND a.country_id = cd.country_id \
                \
                JOIN hris_worker w \
                    ON w.account_id = a.account_id \
                JOIN hris_ren_data r \
                    ON w.ren_id = r.ren_id \
                \
                LEFT JOIN hris_phone_data p \
                    ON p.ren_id = r.ren_id \
                LEFT JOIN hris_phonetype_trans pt \
                    ON p.phonetype_id = pt.phonetype_id \
                    AND pt.language_code = 'en' \
                LEFT JOIN hris_email e \
                    ON r.ren_id = e.ren_id \
                    AND e.email_issecure = 1 \
                \
                LEFT JOIN hris_assignment asgn \
                    ON r.ren_id = asgn.ren_id \
                    AND asgn.assignment_isprimary = 1 \
                LEFT JOIN hris_assign_team_data asgn_t \
                    ON asgn.team_id = asgn_t.team_id \
                LEFT JOIN hris_xref_team_location xtl \
                    ON asgn.team_id = xtl.team_id \
                LEFT JOIN hris_assign_location_trans lt \
                    ON xtl.location_id = lt.location_id \
                    AND lt.language_code = 'en' \
            \
            GROUP BY \
                r.ren_id \
        ", [ countryCode ], function(err, results) {
            if (err) {
                dfd.reject(err);
            } else {
                dfd.resolve(results);
            }
        });
        
        return dfd;
    },
    
    
    /**
     * Find workers from a given country and list them by their account numbers.
     *
     * Each worker's region, secure email and telephone numbers are included.
     * Region is derived from the worker's primary assignment.
     *
     * Telephone numbers have (H), (O), or (M) appended depending on the type
     * of number (home, office, mobile). If a worker has multiple phone numbers
     * they will all be included, separated by commas.
     *
     * @param object options
     *          - string countryCode
     *                Optional. Default is to find staff from all countries.
     *          - boolean groupByRegion
     *                Default is false.
     * @return Deferred
     */
    workersByAccount: function(options) {
        var dfd = AD.sal.Deferred();
        
        options = options || {};
        options.countryCode = options.countryCode || '';
        options.groupByRegion = options.groupByRegion || false;
        
        LHRISWorker.findWorkersInfo(options.countryCode)
        .fail(dfd.reject)
        .done(function(workers) {
            
            LHRISAssignLocation.mapToRegion()
            .fail(dfd.reject)
            .done(function(locations, regions) {
                // Use the location+region lists to add to the worker info
                var workersByRegion = {};
                var workersByAccount = {};
                for (var i=0; i<workers.length; i++) {
                    var locationID = workers[i].location_id;
                    var accountNum = parseInt(workers[i]['Account Number'].replace(/\D/g, ''));
                    if (locations[locationID]) {
                        var regionID = locations[locationID].region_location_id;
                        var regionLabel = regions[regionID].name;
                        // City just means their lowest level location
                        var cityLabel = locations[locationID].location_label;
                    } else {
                        var regionLabel = 'none';
                        var cityLabel = 'none';
                    }
                    workers[i].Region = regionLabel;
                    workers[i].City = cityLabel;
                    
                    // Merge info for married couples
                    if (workersByAccount[accountNum]) {
                        var spouseInfo = workersByAccount[accountNum];
                        for (var key in spouseInfo) {
                            var thisValue = workers[i][key];
                            var spouseValue = spouseInfo[key];
                            // Use spouse's value if spouse is POC, or if only
                            // spouse has a value in that field.
                            if (!thisValue || spouseInfo.isPOC && spouseValue) {
                                workers[i][key] = spouseValue;
                            }
                        }
                    }
                    
                    // Grouped by region
                    workersByRegion[regionLabel] = workersByRegion[regionLabel] || {};
                    workersByRegion[regionLabel][accountNum] = workers[i];
                    
                    // Flat list
                    workersByAccount[accountNum] = workers[i];
                }
                
                if (options.groupByRegion) {
                    dfd.resolve(workersByRegion);
                } else {
                    dfd.resolve(workersByAccount);
                }
            });
        });
        
        return dfd;
    },
    
    
    /**
     * Find active workers that have a current team assignment.
     * Includes worker name & gender, team name, location, and MCC.
     *
     * @param {String} [langCode]
     *      Language code of labels for gender, team name, etc.
     *      Default is 'en'.
     * @return {Promise}
     */
    activeAssignedWorkers: function(langCode='en') {
        return new Promise((resolve, reject) => {
            LHRISWorker.query(`
                
                SELECT
                    ren.ren_id, ren.ren_guid,
                    ren.ren_surname, ren.ren_givenname, ren.ren_preferredname,
                    gen.gender_id, genT.gender_label,
                    team.team_id, teamT.team_label,
                    pos.position_id, posT.position_label,
                    team.parent_id, location.location_id,
                    mccT.mcc_label AS mcc
                FROM
                    hris_assign_team_data team
                    
                    -- Team
                    JOIN hris_assign_team_trans teamT
                        ON team.team_id = teamT.team_id
                        AND teamT.language_code = ?
                    
                    -- Team location
                    JOIN hris_xref_team_location xtl
                        ON team.team_id = xtl.team_id
                    JOIN hris_assign_location_data location
                        ON xtl.location_id = location.location_id
                        
                    -- Team MCC label
                    JOIN hris_assign_mcc_trans mccT
                        ON team.mcc_id = mccT.mcc_id
                        AND mccT.language_code = ?
                    
                    -- Assignment
                    JOIN hris_assignment assign
                        ON assign.team_id = team.team_id
                        AND assign.assignment_isprimary
                        AND (
                            assign.assignment_enddate = '1000-01-01'
                            OR assign.assignment_enddate > NOW()
                        )
                    
                    -- Assignment position
                    JOIN hris_assign_position_data pos
                        ON assign.position_id = pos.position_id
                    JOIN hris_assign_position_trans posT
                        ON pos.position_id = posT.position_id
                        AND posT.language_code = ?
                    
                    -- Ren
                    JOIN hris_ren_data ren
                        ON assign.ren_id = ren.ren_id
                        AND ren.statustype_id IN (3, 4, 5)
                    JOIN hris_gender_data gen
                        ON ren.gender_id = gen.gender_id
                    JOIN hris_gender_trans genT
                        ON gen.gender_id = genT.gender_id
                        AND genT.language_code = ?
                    
                    JOIN hris_worker w
                        ON ren.ren_id = w.ren_id
                        AND w.worker_dateleftchinamin = '1000-01-01'
                        AND w.worker_terminationdate = '1000-01-01'
                    
                    -- Ensure only one result per person
                    GROUP BY
                        ren.ren_id
            
            `, 
            [langCode, langCode, langCode, langCode, langCode], 
            (err, list) => {
                if (err) reject(err);
                else if (!list || !list[0]) {
                    reject(new Error('No HRIS data found'));
                }
                else {
                    resolve(list);
                }
            });
        });
    }
    
};


/**
* LHRISWorker.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var AD = require('ad-utils');

module.exports = {

    // tableName:"lhris_account",
    tableName:"hris_worker",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    migrate:'safe',  // don't update the tables!


    connection:"legacy_hris",
// connection:"hris",


    attributes: {

        worker_id : {
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

        account_id : {
            model: 'LHRISAccount'
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
                    } else {
                        var regionLabel = 'none';
                    }
                    workers[i].Region = regionLabel;
                    
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
    }
};


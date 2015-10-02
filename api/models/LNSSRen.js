/**
* LNSSRen.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var AD = require('ad-utils');

module.exports = {

    tableName:"nss_core_ren",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    // migrate:'safe',  // don't update the tables!



    connection:"legacy_stewardwise",



    attributes: {

        nssren_id : {
            type : "integer",
            size : 11,
            primaryKey : true,
            autoIncrement : true
        }, 

        ren_id : {
            type : "integer",
            size : 11,
            defaultsTo : "0"
        }, 

        nssren_salaryAmount : {
            type : "float",
            defaultsTo : "0"
        }, 

        nssren_salaryCap : {
            type : "float",
            defaultsTo : "0"
        }, 

        nssren_additionalCap : {
            type : "float",
            defaultsTo : "0"
        }, 

        nssren_nscID : {
            type : "integer",
            size : 11,
            defaultsTo : "0"
        }, 

        nssren_per1 : {
            type : "float",
            defaultsTo : "0"
        }, 

        nssren_per2 : {
            type : "float",
            defaultsTo : "0"
        }, 

        nssren_per3 : {
            type : "float",
            defaultsTo : "0"
        }, 

        nssren_per4 : {
            type : "float",
            defaultsTo : "0"
        }, 

        nssren_per5 : {
            type : "float",
            defaultsTo : "0"
        }, 

        nssren_per6 : {
            type : "float",
            defaultsTo : "0"
        }, 

        nssren_per7 : {
            type : "float",
            defaultsTo : "0"
        }, 

        nssren_per8 : {
            type : "float",
            defaultsTo : "0"
        }, 

        nssren_per9 : {
            type : "float",
            defaultsTo : "0"
        }, 

        nssren_per10 : {
            type : "float",
            defaultsTo : "0"
        }, 

        nssren_per11 : {
            type : "float",
            defaultsTo : "0"
        }, 

        nssren_per12 : {
            type : "float",
            defaultsTo : "0"
        }, 

        nssren_isActive : {
            type : "integer",
            size : 2,
            defaultsTo : "1"
        }, 

        nssren_ytdBaseSalary : {
            type : "float",
            defaultsTo : "0"
        }, 

        nssren_ytdCode7000Additional : {
            type : "float",
            defaultsTo : "0"
        }, 

        nssren_ytdCode7000Deductions : {
            type : "float",
            defaultsTo : "0"
        }, 

        nssren_ytdBalance : {
            type : "float",
            defaultsTo : "0"
        }, 

        nssren_balancePeriod : {
            type : "string",
            size : 7
        }, 
        
        /*
        // Deprecated
        territory_id : {
            type : "integer",
            size : 11,
            defaultsTo : "0"
        }, 
        */

        nssren_monthsdonations : {
            type : "float",
            defaultsTo : "0"
        }, 

        nssren_emailNotifications : {
            type : "integer",
            size : 2,
            defaultsTo : "1"
        }, 

        nssren_lastBalanceUpdate : {
            type : "date",
            defaultsTo : "0000-00-00",
            required:false
        }, 

        nssren_advancesAllowed : {
            type : "integer",
            size : 11,
            defaultsTo : "1"
        }, 

        nssren_13MonthReportDate : {
            type : "date",
            defaultsTo : "0000-00-00",
            required:false
        }, 

        nssren_mergeDate : {
            type : "date",
            defaultsTo : "0000-00-00",
            required:false
        }, 

        ren_guid : {
            type : "text"
        }, 
        
        territories: {
            collection: 'LNSSRenTerritory',
            via: 'nssren_id'
        }

    },
    
    
    ////////////////////////////
    // Model class methods
    ////////////////////////////
    
    /**
     * Stewardwise & HRIS info of all active staff
     * {
     *    [ 
     *      {
     *        "name": <string>,         // Surname, Given name (Preferred)
     *        "chineseName": <string>,
     *        "accountNum": <string>,   // 10XXXX
     *        "baseSalary": <integer>,  // ytdBalance
     *        "email": <string>,        // secure email
     *        "phone": <string>,        // (H), (O), (M), joined by ', '
     *        "territory": <string>,    // multiple territories joined by ', '
     *        "poc": <boolean>,         // is family point of contact?
     *        "region": <string>,       // derived from territory desc
     *        "regionHRIS": <string>,   // derived from HRIS team location
     *        "location_id": <integer>,
     *        "ren_guid": <string>
     *      },
     *      ...
     *    ]
     * }
     *
     * @param string regionCode
     *      Optional. Only fetch staff from this territory region.
     * @return Deferred
     */
    staffInfo: function(regionCode) {
        var dfd = AD.sal.Deferred();
        var hris = sails.config.connections.legacy_hris.database;
        if (!hris) {
            throw new Error('legacy_hris connection not defined in the config');
        }
        
        // If region was specified, then filter results by adding a HAVING 
        // clause to the sql.
        var regionCode = regionCode || null;
        var havingClause = "";
        if (typeof regionCode == 'string') {
            havingClause = " HAVING region = ? ";
        }
        
        LNSSRen.query(" \
            SELECT \
                CONCAT( \
                    r.ren_surname, ', ', r.ren_givenname, \
                    ' (', r.ren_preferredname, ')' \
                ) AS name, \
                r.ren_namecharacters AS chineseName, \
                REPLACE(a.account_number, '-', '') AS accountNum, \
                nr.nssren_salaryAmount AS baseSalary, \
                nr.nssren_ytdBalance AS accountBal, \
                e.email_address AS email, \
                GROUP_CONCAT(DISTINCT \
                    p.phone_number, ' (', \
                    SUBSTRING(ptt.phonetype_label, 1, 1), ')' \
                    SEPARATOR ', ' \
                ) AS phone, \
                SUBSTRING( \
                    t.territory_desc, 1, LOCATE('-', t.territory_desc)-1 \
                ) AS region, \
                GROUP_CONCAT(t.territory_desc SEPARATOR ', ') AS territory, \
                r.ren_isfamilypoc AS poc, \
                xtl.location_id, \
                nr.ren_guid \
            \
            FROM \
                "+hris+".hris_ren_data AS r \
                JOIN nss_core_ren AS nr \
                    ON nr.ren_guid = r.ren_guid \
                    AND nr.nssren_isActive = 1 \
                \
                JOIN "+hris+".hris_worker AS w \
                    ON r.ren_id = w.ren_id \
                JOIN "+hris+".hris_account AS a \
                    ON w.account_id = a.account_id \
                \
                JOIN nss_core_renterritory AS rt \
                    ON nr.nssren_id = rt.nssren_id \
                JOIN nss_core_territory AS t \
                    ON rt.territory_id = t.territory_id \
                \
                LEFT JOIN "+hris+".hris_phone_data AS p \
                    ON r.ren_id = p.ren_id \
                LEFT JOIN "+hris+".hris_phonetype_trans AS ptt \
                    ON p.phonetype_id = ptt.phonetype_id \
                    AND ptt.language_code = 'en' \
                LEFT JOIN "+hris+".hris_email AS e \
                    ON r.ren_id = e.ren_id \
                    AND e.email_issecure = 1 \
                \
                LEFT JOIN "+hris+".hris_assignment AS asgn \
                    ON r.ren_id = asgn.ren_id \
                    AND asgn.assignment_isprimary = 1 \
                LEFT JOIN "+hris+".hris_assign_team_data AS asgn_t \
                    ON asgn.team_id = asgn_t.team_id \
                LEFT JOIN "+hris+".hris_xref_team_location AS xtl \
                    ON asgn.team_id = xtl.team_id \
            \
            GROUP BY \
                r.ren_id \
            \
            "+ havingClause +" \
            \
        ", [regionCode], function(err, staff) {
            if (err) {
                dfd.reject(err);
            } else {
                LHRISAssignLocation.mapToRegion()
                .fail(dfd.reject)
                .done(function(locations, regions) {
                    // Merge HRIS team region into the staff entries
                    for (var i=0; i<staff.length; i++) {
                        var locationID = staff[i].location_id;
                        if (locations[locationID]) {
                            var regionID = locations[locationID].region_location_id;
                            var regionLabel = regions[regionID].name;
                        } else {
                            var regionLabel = 'none';
                        }
                        staff[i].regionHRIS = regionLabel;
                    }
                    dfd.resolve(staff);
                });
            }
        });
        
        return dfd;
    },
    
    
    /**
     * Stewardwise & HRIS info of active staff, indexed by account number.
     * Married couples usually share account numbers. So when an account has
     * multiple staff, the family point of contact will have priority in being
     * listed.
     *
     * @param string regionCode
     * @return Deferred
     */
    staffInfoByAccount: function(regionCode) {
        var dfd = AD.sal.Deferred();
        
        LNSSRen.staffInfo(regionCode)
        .fail(dfd.reject)
        .done(function(list) {
            var byAccount = {};
            for (var i=0; i<list.length; i++) {
                var account = parseInt(list[i].accountNum);
                if (!byAccount[account] || list[i].poc) {
                    byAccount[account] = list[i];
                }
            }
            dfd.resolve(byAccount);
        });
        
        return dfd;
    }
};


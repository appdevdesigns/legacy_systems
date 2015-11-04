/**
* LNSSRen.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var AD = require('ad-utils');
var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();

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
        },
        
        donorRelations: {
            collection: 'LNSSDonorRelations',
            via: 'nssren_id'
        }

    },
    
    
    ////////////////////////////
    // Model class methods
    ////////////////////////////
    
    
    /**
     * Finds the row of data for a staff from either 
     *      - their viewer_guid
     *      - or their account_number
     *
     * This returns a jQuery Deferred. It cannot be chained into other
     * Waterline ORM methods.
     * 
     * Note that viewer_guid is not the same as ren_guid.
     *
     * @param object options
     *      { 
     *          viewerGUID: <string>,   // guid from CAS
     *          account: <string>,      // 10____ from HRIS
     *      }
     * @return Deferred
     */
    findByViewerGUID: function(options) {
        var dfd = AD.sal.Deferred();
        var hris = sails.config.connections.legacy_hris.database;
        if (!hris) {
            throw new Error('legacy_hris connection not defined in the config');
        }
        
        if (!options || !options.viewerGUID && !options.account) {
            throw new Error('Must specify either `viewerGUID` or `account` option');
        }
        
        var viewerGUID = options.viewerGUID || '%';
        var account = options.account || '10____';
        
        LNSSRen.query(" \
            SELECT \
                nr.*, \
                a.account_number, \
                r.ren_givenname, r.ren_surname, r.ren_preferredname, \
                CONCAT( \
                    r.ren_surname, ', ', \
                    r.ren_givenname, ' (', \
                    r.ren_preferredname, ')' \
                ) AS 'name' \
            FROM \
                "+hris+".hris_perm_access AS pa \
                JOIN "+hris+".hris_ren_data AS r \
                    ON pa.viewer_guid LIKE ? \
                    AND pa.ren_id = r.ren_id \
                \
                JOIN "+hris+".hris_worker AS w \
                    ON w.ren_id = r.ren_id \
                JOIN "+hris+".hris_account AS a \
                    ON w.account_id = a.account_id \
                    AND REPLACE(a.account_number, '-', '') LIKE ? \
                \
                JOIN nss_core_ren AS nr \
                    ON r.ren_guid = nr.ren_guid \
            \
        ", [viewerGUID, account], function(err, results) {
            if (err) dfd.reject(err);
            else {
                dfd.resolve(results);
            }
        });
        
        return dfd;
    },
    
    // Alias
    findByAccount: function(options) {
        return this.findByViewerGUID(options);
    },
    
    
    /**
     * Find the transactions from the current open period
     * - payroll
     * - reimbursements
     * - donations
     * - account transfers
     *
     * @param object options
     *  { nssrenID: <int> }
     * @return Deferred
     */
    currentTransactions: function(options) {
        var dfd = AD.sal.Deferred();
        var hris = sails.config.connections.legacy_hris.database;
        if (!hris) {
            throw new Error('legacy_hris connection not defined in the config');
        }

        var transactions = {
            'payroll': [],
            'reimbursements': [],
            'advances': [],
            'donations': [],
            'transfers': []
        };
        
        var period, periodID;
        var nssrenID = options.nssrenID;
        
        async.auto({
            'getPeriod': function(next) {
                LNSSCoreFiscalPeriod.currentPeriod()
                .fail(next)
                .done(function(data) {
                    period = String(data.fiscalPeriod);
                    periodID = data.requestcutoff_id;
                    next();
                });
            },
            
            'charset': function(next) {
                // Stewardwise has some utf8 text saved in latin1 encoding
                // and it needs to be retreived with that.
                LNSSRen.query("SET NAMES latin1", function(err, results) {
                    if (err) next(err);
                    else next();
                });
            },
            
            'payroll': ['getPeriod', function(next) {
                LNSSRen.query(" \
                    SELECT \
                        tran.*, \
                        terr.territory_desc \
                    FROM \
                        nss_payroll_transactions AS tran \
                        JOIN nss_core_territory terr \
                            ON tran.nsstransaction_territory_id = terr.territory_id \
                    WHERE \
                        nssren_id = ? \
                        AND requestcutoff_id = ? \
                ", [nssrenID, periodID], function(err, results) {
                    if (err) next(err);
                    else {
                        for (var i=0; i<results.length; i++) {
                            var row = results[i];
                            // This amount includes all payroll adjustments
                            transactions.payroll.push({
                                id: 'payroll-' + row.nsstransaction_id,
                                period: period,
                                date: row.nsstransaction_date,
                                credit: 0,
                                debit: row.nsstransaction_totalSalary,
                                type: 'Salary', // code 7000 ?
                                description: 'Payroll from ' + row.territory_desc
                            });
                        }
                        next();
                    }
                });
            }],
            
            'reimbursements': ['getPeriod', 'charset', function(next) {
                LNSSRen.query(" \
                    SELECT \
                        CONCAT('reimb-', reimbursement_id) AS 'id', \
                        ? AS 'period', \
                        reimbursement_dateApproved AS 'date', \
                        0 AS 'credit', \
                        reimbursement_sum AS 'debit', \
                        'Reimbursement' AS 'type', \
                        reimbursement_description AS 'description' \
                    FROM \
                        nss_reimb_reimbursement \
                    WHERE \
                        nssren_id = ? \
                        AND requestcutoff_id = ? \
                        AND reimbursement_status NOT IN ( \
                            'Rejected', 'Draft' \
                        ) \
                    \
                ", [period, nssrenID, periodID], function(err, results) {
                    if (err) next(err);
                    else {
                        for (var i=0; i<results.length; i++) {
                            results[i].description = entities.decode(results[i].description);
                            // Results field names are already set up in the
                            // SQL query.
                            transactions.reimbursements.push(results[i]);
                        }
                        next();
                    }
                });
            }],
            
            'reimbAdvances': ['getPeriod', 'charset', function(next) {
                LNSSRen.query(" \
                    SELECT \
                        CONCAT('reimbAdv-', advance_id) AS 'id', \
                        ? AS 'period', \
                        advance_submittedDate AS 'date', \
                        0 AS 'credit', \
                        advance_amount AS 'debit', \
                        'Reimbursement Advance' AS 'type', \
                        advance_purpose AS 'description' \
                    FROM \
                        nss_reimb_advance \
                    WHERE \
                        nssren_id = ? \
                        AND advance_status IN ( \
                            'Pending_nss', 'Approved', 'Paid' \
                        ) \
                    \
                ", [period, nssrenID], function(err, results) {
                    if (err) next(err);
                    else {
                        for (var i=0; i<results.length; i++) {
                            results[i].description = entities.decode(results[i].description);
                            // Results field names are already set up in the
                            // SQL query.
                            transactions.advances.push(results[i]);
                        }
                        next();
                    }
                });
            }],

            'donations': ['getPeriod', 'charset', function(next) {
                LNSSRen.query(" \
                    SELECT \
                        d.* \
                    FROM \
                        nss_don_donBatch AS d \
                        LEFT JOIN nss_don_glbatch AS gl \
                            ON d.glbatch_id = gl.glbatch_id \
                    WHERE \
                        nssren_id = ? \
                        AND d.donBatch_status = 'Received' \
                        AND ( \
                            d.glbatch_id = 0 \
                            OR gl.glbatch_period > ? \
                        ) \
                ", [nssrenID, period], function(err, results) {
                    if (err) next(err);
                    else {
                        for (var i=0; i<results.length; i++) {
                            var row = results[i];
                            // Split into two transactions. One for the actual
                            // donation, and one for the assessment fee.
                            transactions.donations.push({
                                id: 'don-' + row.donBatch_id +'-A',
                                period: period,
                                date: row.donBatch_dateProcessed,
                                credit: row.donBatch_amount,
                                debit: 0,
                                type: 'Donation',
                                description: 'Donation batch'
                            });
                            transactions.donations.push({
                                id: 'don-' + row.donBatch_id +'-B',
                                period: period,
                                date: row.donBatch_dateProcessed,
                                credit: 0,
                                debit: row.donBatch_fee,
                                type: 'Assessment',
                                description: 'DN' + row.donBatch_id + ' assessment'
                            });
                        }
                        next();
                    }
                });
            }],
            
            'transfers': ['getPeriod', 'charset', function(next) {
                LNSSRen.query(" \
                    SELECT \
                        t.*, \
                        acc1.account_number AS 'sender_account', \
                        acc2.account_number AS 'recipient_account' \
                    FROM \
                        nss_don_transfer t \
                        \
                        JOIN nss_core_ren nr1 \
                            ON t.sender_nssren_id = nr1.nssren_id \
                        JOIN "+hris+".hris_ren_data r1 \
                            ON nr1.ren_guid = r1.ren_guid \
                        JOIN "+hris+".hris_worker w1 \
                            ON r1.ren_id = w1.ren_id \
                        JOIN "+hris+".hris_account acc1 \
                            ON w1.account_id = acc1.account_id \
                        \
                        JOIN nss_core_ren nr2 \
                            ON t.receiver_nssren_id = nr2.nssren_id \
                        JOIN "+hris+".hris_ren_data r2 \
                            ON nr2.ren_guid = r2.ren_guid \
                        JOIN "+hris+".hris_worker w2 \
                            ON r2.ren_id = w2.ren_id \
                        JOIN "+hris+".hris_account acc2 \
                            ON w2.account_id = acc2.account_id \
                        \
                        LEFT JOIN nss_don_glbatch as gl \
                            ON t.glbatch_id = gl.glbatch_id \
                    WHERE \
                        ( \
                            t.glbatch_id = 0 \
                            OR gl.glbatch_period > ? \
                        ) AND (( \
                            receiver_nssren_id = ? \
                            AND transfer_status = 'Completed' \
                        ) OR ( \
                            sender_nssren_id = ? \
                            AND transfer_status NOT IN ('Suspend', 'Canceled') \
                        )) \
                ", [period, nssrenID, nssrenID], function(err, results) {
                    if (err) next(err);
                    else {
                        for (var i=0; i<results.length; i++) {
                            var row = results[i];
                            var packet = {
                                    id: 'xfer-' + row.transfer_id,
                                    period: period,
                                    date: row.transfer_date_processed,
                                    type: 'Account Transfer ',
                                    description: row.transfer_type // monthly / one-time
                            };
                            if (row.sender_nssren_id == nssrenID) {
                                packet.credit = 0;
                                packet.debit = row.transfer_amount;
                                packet.type += 'sent';
                                if (row.transfer_anonymous == 0) {
                                    packet.description += ' transfer to ' + row.recipient_account;
                                } else {
                                    packet.description = 'Anonymous';
                                }
                            } else {
                                packet.debit = 0;
                                packet.credit = row.transfer_amount;
                                packet.type += 'received';
                                if (row.transfer_anonymous == 0) {
                                    packet.description += ' transfer from ' + row.sender_account;
                                } else {
                                    packet.description = 'Anonymous';
                                }
                            }
                            packet.description += ' (' + row.transfer_reason +')';
                            
                            transactions.transfers.push(packet);
                        }
                        next();
                    }
                });
            }],
            
            'revertCharset': [
                'reimbursements', 'reimbAdvances', 'donations', 'transfers',
                function(next) {
                    LNSSRen.query("SET NAMES utf8", function(err, results) {
                        if (err) next(err);
                        else next();
                    });
                }
            ],
            
        }, function(err) {
            if (err) dfd.reject(err);
            else dfd.resolve(transactions);
        });
        
        return dfd;
    },
    
    
    /**
     * Stewardwise & HRIS info of all active staff
     * {
     *    [ 
     *      {
     *        "name": <string>,         // Surname, Given name (Preferred)
     *        "chineseName": <string>,
     *        "accountNum": <string>,   // 10XXXX
     *        "baseSalary": <integer>,  // base monthly salary
     *        "accountBal": <integer>,  // ytdBalance
     *        "email": <string>,        // secure email
     *        "phone": <string>,        // (H), (O), (M), joined by ', '
     *        "territory": <string>,    // multiple territories joined by ', '
     *        "poc": <boolean>,         // is family point of contact?
     *        "region": <string>,       // derived from territory desc
     *        "regionHRIS": <string>,   // derived from HRIS team location
     *        "location_id": <integer>,
     *        "ren_guid": <string>,
     *        "nssren_id": <integer>
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
                nr.ren_guid, \
                nr.nssren_id \
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


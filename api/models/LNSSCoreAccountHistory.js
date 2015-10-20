/**
* LNSSCoreAccountHistory.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var AD = require('ad-utils');

module.exports = {

    tableName:"nss_core_accounthistory",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    // migrate:'safe',  // don't update the tables!



    connection:"legacy_stewardwise",


    attributes: {

        accounthistory_id : {
            type : "integer",
            size : 11,
            primaryKey : true,
            autoIncrement : true
        }, 

        subaccounts_accountNum : {
            type : "string",
            size : 50
        }, 

        accounthistory_fiscalyear : {
            type : "integer",
            size : 11,
            defaultsTo : "0"
        }, 
        
        // Not used
        accounthistory_ytdbal00 : {
            type : "float",
            defaultsTo : "0"
        }, 

        accounthistory_ytdbal01 : {
            type : "float",
            defaultsTo : "0"
        }, 

        accounthistory_ytdbal02 : {
            type : "float",
            defaultsTo : "0"
        }, 

        accounthistory_ytdbal03 : {
            type : "float",
            defaultsTo : "0"
        }, 

        accounthistory_ytdbal04 : {
            type : "float",
            defaultsTo : "0"
        }, 

        accounthistory_ytdbal05 : {
            type : "float",
            defaultsTo : "0"
        }, 

        accounthistory_ytdbal06 : {
            type : "float",
            defaultsTo : "0"
        }, 

        accounthistory_ytdbal07 : {
            type : "float",
            defaultsTo : "0"
        }, 

        accounthistory_ytdbal08 : {
            type : "float",
            defaultsTo : "0"
        }, 

        accounthistory_ytdbal09 : {
            type : "float",
            defaultsTo : "0"
        }, 

        accounthistory_ytdbal10 : {
            type : "float",
            defaultsTo : "0"
        }, 

        accounthistory_ytdbal11 : {
            type : "float",
            defaultsTo : "0"
        }, 

        accounthistory_ytdbal12 : {
            type : "float",
            defaultsTo : "0"
        }, 


    },
    
    
    
    ////////////////////////////
    // Model class methods
    ////////////////////////////
    
    /**
     * Used by recent12Balances()
     *
     * Delivers the account balance history from the past 24 periods in
     * the form of an array. Earlier periods are listed first. Periods in the
     * current year that have not yet passed will also be included. The data
     * collected will be trimmed down for accuracy in recent12Balances().
     *
     * Some newer accounts will only have 12 periods on record, instead of 24.
     *
     * {
     *    <staff account>: [ <balance1>, <balance2>, ... <balance24> ],
     *    ...
     * }
     *
     * @return Deferred
     */
    recent24Balances: function() {
        var dfd = AD.sal.Deferred();
        // Join the history table with the two most recent fiscal years that
        // it has on record. 
        // This will select two rows per account, giving up to the past
        // 24 months of monthly balances each.
        LNSSCoreAccountHistory.query(" \
            SELECT \
                h1.subaccounts_accountNum AS accountNum, \
                h1.accounthistory_fiscalyear AS fiscalYear, \
                h1.accounthistory_ytdbal01 AS p1, \
                h1.accounthistory_ytdbal02 AS p2, \
                h1.accounthistory_ytdbal03 AS p3, \
                h1.accounthistory_ytdbal04 AS p4, \
                h1.accounthistory_ytdbal05 AS p5, \
                h1.accounthistory_ytdbal06 AS p6, \
                h1.accounthistory_ytdbal07 AS p7, \
                h1.accounthistory_ytdbal08 AS p8, \
                h1.accounthistory_ytdbal09 AS p9, \
                h1.accounthistory_ytdbal10 AS p10, \
                h1.accounthistory_ytdbal11 AS p11, \
                h1.accounthistory_ytdbal12 AS p12 \
            \
            FROM \
                nss_core_accounthistory AS h1 \
                JOIN ( \
                    SELECT DISTINCT h2.accounthistory_fiscalyear AS yyyy \
                    FROM nss_core_accounthistory AS h2 \
                    ORDER BY h2.accounthistory_fiscalyear DESC \
                    LIMIT 2 \
                ) AS recentTwoYears \
                    ON h1.accounthistory_fiscalyear = recentTwoYears.yyyy \
            \
            ORDER BY \
                h1.subaccounts_accountNum ASC, \
                h1.accounthistory_fiscalyear ASC \
        ", function(err, results) {
            if (err) {
                dfd.reject(err);
            } else {
                var byAccount = {};
                // Gather each account's monthly balance figures into an array
                for (var i=0; i<results.length; i++) {
                    var account = results[i].accountNum;
                    byAccount[account] = byAccount[account] || [];
                    for (var p=1; p<=12; p++) {
                        byAccount[account].push(results[i]['p'+p]);
                    }
                }
                dfd.resolve(byAccount);
            }
        });
        
        return dfd;
    },
    
    
    /**
     * Find the most recent 12 periods that have balance data.
     *
     * [ 
     *    {
     *      yyyymm: "201510",
     *      month: 10,
     *      year: 2015
     *    },
     *    {
     *      yyyymm: "201511",
     *      month: 11,
     *      year: 2015
     *    },
     *    ...,
     *    {
     *      yyyymm: "201609",
     *      month: 9,
     *      year: 2016
     *    },
     * 
     *
     * @return Deferred
     */
    recent12Periods: function() {
        var dfd = AD.sal.Deferred();
        // Find the empty periods from this year, where all balances are zero.
        LNSSCoreAccountHistory.query("\
            SELECT \
                accounthistory_fiscalyear AS year, \
                SUM(h1.accounthistory_ytdbal01) AS s1, \
                SUM(h1.accounthistory_ytdbal02) AS s2, \
                SUM(h1.accounthistory_ytdbal03) AS s3, \
                SUM(h1.accounthistory_ytdbal04) AS s4, \
                SUM(h1.accounthistory_ytdbal05) AS s5, \
                SUM(h1.accounthistory_ytdbal06) AS s6, \
                SUM(h1.accounthistory_ytdbal07) AS s7, \
                SUM(h1.accounthistory_ytdbal08) AS s8, \
                SUM(h1.accounthistory_ytdbal09) AS s9, \
                SUM(h1.accounthistory_ytdbal10) AS s10, \
                SUM(h1.accounthistory_ytdbal11) AS s11, \
                SUM(h1.accounthistory_ytdbal12) AS s12 \
            FROM \
                nss_core_accounthistory AS h1 \
                JOIN ( \
                    SELECT DISTINCT h2.accounthistory_fiscalyear AS yyyy \
                    FROM nss_core_accounthistory AS h2 \
                    ORDER BY h2.accounthistory_fiscalyear DESC \
                    LIMIT 1 \
                ) AS recentOneYear \
                    ON h1.accounthistory_fiscalyear = recentOneYear.yyyy \
        ", function(err, results) {
            if (err) {
                dfd.reject(err);
            } else {
                var row = results[0];
                
                // Find the final period where everyone has balances
                var startPeriod, finalPeriod, fiscalYear;
                var s = 12;
                while (s > 0 && (row['s'+s] == 0)) {
                    s -= 1;
                }
                
                if (s == 0) {
                    // None of the periods in this fiscal year have balances.
                    // So the latest period must be the final period from the
                    // previous year.
                    fiscalYear = row.year - 1;
                    startPeriod = 1;
                    finalPeriod = 12;
                } else if (s == 12) {
                    // All of the periods this fiscal year have balances.
                    // No need to go back a year to get all 12.
                    fiscalYear = row.year;
                    startPeriod = 1;
                    finalPeriod = 12;
                } else {
                    // Current period is in the middle of the year.
                    // Go to last year to find the start.
                    fiscalYear = row.year - 1;
                    startPeriod = s + 1;
                    finalPeriod = s;
                }
                
                var recentPeriods = [];
                var period = startPeriod;
                for (var i=0; i<12; i++) {
                    recentPeriods.push({
                        yyyymm: ''+fiscalYear+pad(period),
                        month: period,
                        year: fiscalYear
                    });
                    period += 1;
                    if (period > 12) {
                        period = 1;
                        fiscalYear += 1;
                    }
                }
                
                dfd.resolve(recentPeriods);
            }
        });
            
        return dfd;
    },
    
    
    
    /**
     * Delivers the account balance history from the past 12 periods in
     * the form of an array. Earlier periods are listed first.
     *
     * {
     *    <staff account>: [ <balance1>, <balance2>, ... <balance24> ],
     *    ...
     * }
     * 
     * @return Deferred
     */
    recent12Balances: function(accounts) {
        var dfd = AD.sal.Deferred();
        
        LNSSCoreAccountHistory.recent12Periods()
        .fail(dfd.reject)
        .done(function(data) {
            
            var periods = [];
            for (var i=0; i<data.length; i++) {
                periods.push(data[i].yyyymm);
            }
            
            LNSSCoreAccountHistory.balanceForPeriods(periods, accounts)
            .fail(dfd.reject)
            .done(function(data) {
                dfd.resolve(data);
            });
            
        });
        
        return dfd;
    },
    
    
    
    /**
     * Delivers the account balance history from the past 12 periods in
     * the form of an array. Earlier periods are listed first.
     *
     * {
     *    <staff account>: [ <balance1>, <balance2>, ... <balance24> ],
     *    ...
     * }
     * 
     * @return Deferred
     */
    recent12BalancesOLD: function() {
        var dfd = AD.sal.Deferred();
        // Find the recent year's periods where all balances are zero.
        // These periods will be removed from recent24Balances()'s results.
        LNSSCoreAccountHistory.query("\
            SELECT \
                SUM(h1.accounthistory_ytdbal01) AS s1, \
                SUM(h1.accounthistory_ytdbal02) AS s2, \
                SUM(h1.accounthistory_ytdbal03) AS s3, \
                SUM(h1.accounthistory_ytdbal04) AS s4, \
                SUM(h1.accounthistory_ytdbal05) AS s5, \
                SUM(h1.accounthistory_ytdbal06) AS s6, \
                SUM(h1.accounthistory_ytdbal07) AS s7, \
                SUM(h1.accounthistory_ytdbal08) AS s8, \
                SUM(h1.accounthistory_ytdbal09) AS s9, \
                SUM(h1.accounthistory_ytdbal10) AS s10, \
                SUM(h1.accounthistory_ytdbal11) AS s11, \
                SUM(h1.accounthistory_ytdbal12) AS s12 \
            FROM \
                nss_core_accounthistory AS h1 \
                JOIN ( \
                    SELECT DISTINCT h2.accounthistory_fiscalyear AS yyyy \
                    FROM nss_core_accounthistory AS h2 \
                    ORDER BY h2.accounthistory_fiscalyear DESC \
                    LIMIT 1 \
                ) AS recentOneYear \
                    ON h1.accounthistory_fiscalyear = recentOneYear.yyyy \
        ", function(err, results) {
            if (err) {
                dfd.reject(err);
            } else {
                // Find the final period where everyone has balances
                var finalPeriod = 25;
                for (var s=12; s>=1; s--) {
                    // Count backwards until we find a nonzero balance period
                    var thisPeriod = s+12;
                    if (results[0]['s'+s] == 0) {
                        finalPeriod = thisPeriod;
                    } else {
                        break;
                    }
                }
                
                // Calculate base-0 array indexes
                var indexEnd = finalPeriod - 1;
                var indexStart = indexEnd - 12;
                
                // Trim away the excess periods from recent24Balances()
                LNSSCoreAccountHistory.recent24Balances()
                .fail(dfd.reject)
                .done(function(byAccount) {
                    for (var num in byAccount) {
                        var balances = byAccount[num];
                        if (balances.length == 24) {
                            byAccount[num] = balances.slice(indexStart, indexEnd);
                        } else {
                            // New accounts may have less periods on record
                            balances = balances.slice(0, indexEnd-12);
                            while (balances.length < 12) {
                                // Pad the beginning of the array with 0s
                                balances.unshift(0);
                            }
                            byAccount[num] = balances;
                        }
                    }
                    dfd.resolve(byAccount);
                });
            }
        });
        
        return dfd;
    },
    
    
    /**
     * @param array periods
     *    Array of yyyymm period strings.
     * @param string account
     *    Optional. Only fetch balances for this account.
     * @return Deferred
     */
    balanceForPeriods: function(periods, account) {
        var dfd = AD.sal.Deferred();
        
        var accountFilter = account || '10____';
        
        // Find out which fiscal years are being requested
        var years = [];
        for (var i=0; i<periods.length; i++) {
            var yyyy = periods[i].slice(0,4);
            if (years.indexOf(yyyy) < 0) {
                years.push(yyyy);
            }
        }
        
        LNSSCoreAccountHistory.find()
        .where({ accounthistory_fiscalyear: years })
        .where({ subaccounts_accountNum: {'like': accountFilter} })
        .fail(function(err) {
            dfd.reject(err);
        })
        .then(function(list) {
            
            var results = {
            /*
                <account>: {
                    <period>: balance,
                    ...
                },
                ...
            */
            };
            
            for (var i=0; i<list.length; i++) {
                var yyyy = list[i].accounthistory_fiscalyear;
                var account = list[i].subaccounts_accountNum;
                
                results[account] = results[account] || {};
                
                for (var m=1; m<=12; m++) {
                    var mm = pad(m);
                    var period = ''+yyyy+mm;
                    var balanceField = 'accounthistory_ytdbal' + mm;
                    if (periods.indexOf(period) >= 0) {
                        // If this period was requested, add its balance to the
                        // results.
                        results[account][period] = list[i][balanceField];
                    }
                }
            }
            
            dfd.resolve(results);
        });
        
        return dfd;
    }
    
};


// Pads a number with a leading zero if its value is less than 10.
var pad = function(num) {
    if (num >= 10) return String(num);
    else return '0' + String(num);
}

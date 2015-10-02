/**
* LNSSCoreGLTrans.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var AD = require('ad-utils');

module.exports = {

    // tableName:"lnss_core_gltran",
    tableName:"nss_core_gltran",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    // migrate:'safe',  // don't update the tables!



    connection:"legacy_stewardwise",



    attributes: {

        gltran_id : {
            type : "integer",
            size : 11,
            primaryKey : true,
            autoIncrement : true
        }, 

        gltran_acctnum : {
            type : "integer",
            size : 11,
            defaultsTo : "0"
        }, 

        gltran_subacctnum : {
            type : "string",
            size : 50,
            defaultsTo : "0"
        }, 

        gltran_cramt : {
            type : "float",
            defaultsTo : "0"
        }, 

        gltran_dramt : {
            type : "float",
            defaultsTo : "0"
        }, 

        gltran_fiscalyr : {
            type : "integer",
            size : 11,
            defaultsTo : "0"
        }, 

        gltran_refnum : {
            type : "string",
            size : 50,
            defaultsTo : "0"
        }, 

        gltran_trandate : {
            type : "date",
            defaultsTo : "0000-00-00"
        }, 

        gltran_trandesc : {
            type : "string",
            size : 50,
            defaultsTo : "0"
        }, 
        
        // Fiscal period YYYYMM
        gltran_perpost : {
            type : "integer",
            size : 11,
            defaultsTo : "0"
        }, 

        gltran_batchlinenum : {
            type : "integer",
            size : 11,
            defaultsTo : "0"
        }, 

        gltran_linenum : {
            type : "integer",
            size : 11,
            defaultsTo : "0"
        }, 


    },
    
    
    ////////////////////////////
    // Model class methods
    ////////////////////////////
    
    /**
     * Average amount of funds leaving the account per month, over the past
     * twelve months.
     *
     * {
     *    <staff account>: <avgExpenditure>,
     *    ...
     * }
     *
     * @param string startingPeriod
     *      The gltran_perpost period from 12 months ago.
     *      Format: YYYYMM
     * @return Deferred
     */
    avgMonthlyExpenditure: function(startingPeriod) {
        var dfd = AD.sal.Deferred();
        
        LNSSCoreGLTrans.query(" \
            SELECT \
                gltran_subacctnum AS account, \
                ROUND(SUM(gltran_dramt) / 12) AS avgExpenditure \
            FROM \
                nss_core_gltran \
            WHERE \
                gltran_perpost > ? \
                AND gltran_dramt > 0 \
                AND gltran_subacctnum LIKE '10____' \
            GROUP BY \
                gltran_subacctnum \
        ", [startingPeriod], function(err, results) {
            if (err) {
                dfd.reject(err);
            } else {
                var resultsByAccount = {};
                for (var i=0; i<results.length; i++) {
                    var account = results[i].account;
                    var avgExpenditure = results[i].avgExpenditure;
                    resultsByAccount[account] = avgExpenditure;
                }
                dfd.resolve(resultsByAccount);
            }
        });
        
        return dfd;
    },
    
    
    /**
     * The average amount of funds added from local sources per month,
     * over the past twelve months.
     *
     * {
     *    <staff account>: <avgLocalContrib>,
     *    ...
     * }
     *
     * @param string startingPeriod
     *      The gltran_perpost period from 12 months ago.
     *      Format: YYYYMM
     * @return Deferred
     */
    avgLocalContrib: function(startingPeriod) {
        var dfd = AD.sal.Deferred();
        
        LNSSCoreGLTrans.query(" \
            SELECT \
                gltran_subacctnum AS account, \
                ROUND((SUM(gltran_dramt) + SUM(gltran_cramt)) / 12) AS avgLocalContrib \
            FROM \
                nss_core_gltran \
            WHERE \
                gltran_perpost > ? \
                AND gltran_acctnum IN ('4000', '4010') \
                AND gltran_subacctnum LIKE '10____' \
            GROUP BY \
                gltran_subacctnum \
        ", [startingPeriod], function(err, results) {
            if (err) {
                dfd.reject(err);
            } else {
                var resultsByAccount = {};
                for (var i=0; i<results.length; i++) {
                    var account = results[i].account;
                    var avgLocalContrib = results[i].avgLocalContrib;
                    resultsByAccount[account] = avgLocalContrib;
                }
                dfd.resolve(resultsByAccount);
            }
        });
        
        return dfd;
    },
    
    
    /**
     * The average amount of funds added from foreign sources per month,
     * over the past twelve months.
     *
     * {
     *    <staff account>: <avgSalary>,
     *    ...
     * }
     *
     * @param string startingPeriod
     *      The gltran_perpost period from 12 months ago.
     *      Format: YYYYMM
     * @return Deferred
     */
    avgForeignContrib: function(startingPeriod) {
        var dfd = AD.sal.Deferred();
        
        // gltran_acctnum meanings:
        //  7000 - salary, additional salary, short pay, reduce ytd salary paid
        //  1200 - deduction
        //  1250 - salary advance, clear salary advance
        //  1210 - correction to ytd salary
        // so i guess we just count the 7000 transactions?
        
        // Total up all the base salary, adjustment credits and debits
        // and divide by 12.
        LNSSCoreGLTrans.query(" \
            SELECT \
                gltran_subacctnum AS account, \
                ROUND((SUM(gltran_dramt) + SUM(gltran_cramt)) / 12) AS avgSal \
            FROM \
                nss_core_gltran \
            WHERE \
                gltran_perpost > ? \
                AND gltran_acctnum IN ('7000') \
                AND gltran_subacctnum LIKE '10____' \
            GROUP BY \
                gltran_subacctnum \
        ", [startingPeriod], function(err, results) {
            if (err) {
                dfd.reject(err);
            } else {
                var resultsByAccount = {};
                for (var i=0; i<results.length; i++) {
                    var account = results[i].account;
                    var avgSalary = results[i].avgSal;
                    resultsByAccount[account] = avgSalary;
                }
                dfd.resolve(resultsByAccount);
            }
        });
        
        return dfd;
    },
    
    
    /**
     * The average amount of monthly salary over the past 12 months.
     *
     * {
     *    <staff account>: <avgSalary>,
     *    ...
     * }
     *
     * @param string startingPeriod
     *      The gltran_perpost period from 12 months ago.
     *      Format: YYYYMM
     * @return Deferred
     */
    avgSalary: function(startingPeriod) {
        var dfd = AD.sal.Deferred();
        
        LNSSCoreGLTrans.query(" \
            SELECT \
                gltran_subacctnum AS account, \
                ROUND((SUM(gltran_dramt) + SUM(gltran_cramt)) / 12) AS avgForeignContrib \
            FROM \
                nss_core_gltran \
            WHERE \
                gltran_perpost > ? \
                AND gltran_acctnum = '5000' \
                AND gltran_subacctnum LIKE '10____' \
            GROUP BY \
                gltran_subacctnum \
        ", [startingPeriod], function(err, results) {
            if (err) {
                dfd.reject(err);
            } else {
                var resultsByAccount = {};
                for (var i=0; i<results.length; i++) {
                    var account = results[i].account;
                    var avgForeignContrib = results[i].avgForeignContrib;
                    resultsByAccount[account] = avgForeignContrib;
                }
                dfd.resolve(resultsByAccount);
            }
        });
    
        return dfd;
    },
    
    
    /**
     * The recent fiscal periods where each staff made a short pay adjustment.
     * (i.e. reduced their salary for that month)
     *
     * Periods are delivered as integers, representing the number of months
     * after the startingPeriod.
     *
     * {
     *    <staff account>: [ <int>, ... ],
     *    ...
     * }
     *
     * @param string startingPeriod
     *      The gltran_perpost period from 12 months ago.
     *      Format: YYYYMM
     * @return Deferred
     */
    shortPayPeriods: function(startingPeriod) {
        var dfd = AD.sal.Deferred();
        
        LNSSCoreGLTrans.query(" \
            SELECT \
                gltran_subacctnum AS accountNum, \
                COUNT(DISTINCT gltran_perpost) AS count, \
                GROUP_CONCAT(DISTINCT \
                    PERIOD_DIFF(gltran_perpost, ?) \
                ) AS p \
            FROM \
                nss_core_gltran \
            WHERE \
                gltran_perpost > ? \
                AND gltran_acctnum = '7000' \
                AND gltran_cramt > 0 \
                AND gltran_subacctnum LIKE '10____' \
            GROUP BY \
                gltran_subacctnum \
        ", [startingPeriod, startingPeriod], function(err, results) {
            if (err) {
                dfd.reject(err);
            } else {
                var byAccount = {};
                for (var i=0; i<results.length; i++) {
                    var account = results[i].accountNum;
                    byAccount[account] = [];
                    if (results[i].count > 0) {
                        // Results are a string joined by commas so split
                        // into an array.
                        byAccount[account] = String(results[i].p).split(',');
                    }
                }
                dfd.resolve(byAccount);
            }
        });
        
        return dfd;
    }
    
    
};



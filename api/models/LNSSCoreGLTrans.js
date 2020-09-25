/**
* LNSSCoreGLTrans.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var AD = require('ad-utils');

const newCOA = {
    expenses: [
        6111, 6611, 6621, 7111, 7131, 7211, 
        7511, 8111, 8121, 8211, 8411, 8611, 
        8631, 8641, 8642, 8681, 8682, 8683, 
        8684, 8711, 8721, 8911, 8921, 8931, 
        8941, 8951, 8991, 9521, 9591,
        9511 // local transfer outbound
    ],
    localIncome: [
        41111, 41112, 41113, 41114, 4391, 4411, 
        4911, 4912, 4921, 4931, 4991, 9191, 
        9111 // local transfer inbound
    ],
    foreignIncome: [5111, 5611, 5621]
};

module.exports = {

    // tableName:"lnss_core_gltran",
    tableName:"nss_core_gltran",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    migrate:'safe',  // don't update the tables!



    connection:"legacy_stewardwise",



    attributes: {

        'id' : {
            columnName: 'gltran_id',
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
        /*
        gltran_acctnum : {
            model: 'LNSSCoreChartOfAccounts',
            via: 'chartofaccounts_accountNum'
        },
        */

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
     * Finds GL transactions grouped by account.
     *
     * @param array periods
     *      Array of yyyymm period strings.
     * @param string account
     *      Optional. Filter by staff account number.
     * @return Deferred
     *      Resolves with (transactions, byPeriod)
     */
    byAccount: function(periods, account) {
        var dfd = AD.sal.Deferred();
        
        var accountFilter = account || '%';
        
        var transactions = {
        /*
            <staff_account>: [
                {
                    period: 'yyyymm',   // FISCAL PERIOD
                    date: <date>,       // REAL WORLD DATE
                    income: <number>,
                    expenses: <number>,
                    desc: 'description',
                    code: 'gl account code',
                    id: <number>        // gltran_id
                },
                ...
            ],
            ...
        */
        };
        
        var byPeriod = {
        /*
            <staff_account>: {
                <period>: {
                    date: <date>,
                    income: <number>,
                    expenses: <number>
                },
                ...
            },
            ...
        */
        };
        
        LNSSCoreGLTrans.find()
        .where({ gltran_perpost: periods })
        .where({ gltran_subacctnum: {'like': accountFilter} })
        .fail(function(err) {
            dfd.reject(err);
        })
        .then(function(list) {
            for (var i=0; i<list.length; i++) {
                var staffAccount = list[i].gltran_subacctnum;
                var period = list[i].gltran_perpost;
                var date = list[i].gltran_trandate;
                var debit = list[i].gltran_dramt;
                var credit = list[i].gltran_cramt;
                var desc = list[i].gltran_trandesc;
                var glAccount = list[i].gltran_acctnum;
                var id = list[i].gltran_id;
                
                transactions[staffAccount] = transactions[staffAccount] || [];
                transactions[staffAccount].push({
                    period: period,
                    date: date,
                    income: credit,
                    expenses: debit,
                    desc: desc,
                    code: glAccount
                });
                
                byPeriod[staffAccount] = byPeriod[staffAccount] || {};
                byPeriod[staffAccount][period] = byPeriod[staffAccount][period] || { income:0, expenses:0, date:date };
                byPeriod[staffAccount][period].income += credit;
                byPeriod[staffAccount][period].expenses += debit;
            }
            
            dfd.resolve(transactions, byPeriod);
        });
        
        return dfd;
    },
    
    
    
    /**
     * Finds the fiscal period from X months prior to the latest period 
     * on record.
     *
     * @param int monthsBack
     *      The number of months to go back
     * @return Deferred
     */
    getPastPeriod: function(monthsBack) {
        var dfd = AD.sal.Deferred();
        
        LNSSCoreGLTrans.query(" \
            SELECT \
                PERIOD_ADD(MAX(gltran_perpost), ?) AS 'period' \
            FROM \
                nss_core_gltran \
        ", [parseInt(monthsBack) * -1], function(err, results) {
            if (err) {
                dfd.reject(err);
            } else {
                if (results && results[0]) {
                    dfd.resolve(results[0].period);
                } else {
                    dfd.resolve(0);
                }
            }
        });
        
        return dfd;
    },
    
    
    /**
     * Finds the monthly income and expenditure of one account.
     *
     * [
     *    {
     *      "period": <string>
     *      "income": <int>,
     *      "expenditure": <int>
     *    },
     *    ...
     * ]
     *
     * @param string startingPeriod
     *      The gltran_perpost period to start counting from
     *      Format: YYYYMM
     * @param string account
     *      The staff account number
     * @return Deferred
     */
    monthlyIncomeExpenditure: function(startingPeriod, account) {
        var dfd = AD.sal.Deferred();
        
        LNSSCoreGLTrans.query(`
            SELECT
                gltran_perpost AS period,
                ROUND(SUM(gltran_cramt)) AS income,
                ROUND(SUM(gltran_dramt)) AS expenditure
            FROM
                nss_core_gltran
            WHERE
                gltran_perpost > ?
                AND gltran_subacctnum = ?
                AND gltran_acctnum NOT LIKE '1%%%'
                AND gltran_acctnum NOT LIKE '2%%%'
                AND gltran_acctnum NOT LIKE '3%%%'
            GROUP BY
                gltran_perpost
            ORDER BY
                gltran_perpost;
        `, [startingPeriod, account], function(err, results) {
            if (err) {
                dfd.reject(err);
            } else {
                dfd.resolve(results);
            }
        });
        
        return dfd;
    },
    
    
    /**
     * Wrapper for incomeExpensesGroupedByPeriod_multiAccounts().
     *
     * This finds all related staff account numbers for the given account,
     * and calculates the I&E for those as well.
     *
     * @param {string} startingPeriod
     *      The gltran_perpost fiscal period to start counting from.
     *      Format: YYYYMM
     * @param {string} account
     *      The staff account number
     * @return {Promise}
     *      Resolves with dictionary basic object indexed by calendar period.
     */
    incomeExpensesGroupedByPeriod: function(startingPeriod, account) {
        return LHRISAccount.relatedAccounts(account)
            .then((allAccounts) => {
                return LNSSCoreGLTrans.incomeExpensesGroupedByPeriod_multiAccounts(startingPeriod, allAccounts);
            });
    },
    
    
    /**
     * For a given array of staff accounts, group and sum income & expenses by 
     * calendar period.
     *
     * {
     *    "YYYYMM": {
     *      "fiscalPeriod": <string>, // different from calendar period
     *      "localIncome": <number>,
     *      "foreignIncome": <number>,
     *      "expenses": <number>
     *    },
     *    ...
     * }
     *
     * @param {string} startingPeriod
     *      The gltran_perpost fiscal period to start counting from.
     *      Format: YYYYMM
     * @param {string|array} accounts
     *      The staff account number(s)
     * @return {Promise}
     *      Resolves with dictionary basic object indexed by calendar period.
     */
    incomeExpensesGroupedByPeriod_multiAccounts: function(startingPeriod, accounts) {
        return new Promise((resolve, reject) => {
            
            // Build account number string for use with IN ('foo', 'bar', ...)
            var accountString;
            if (!Array.isArray(accounts)) {
                accounts = [accounts];
            }
            for (let i=0; i<accounts.length; i++) {
                // Escape apostrophe chars for SQL
                accounts[i] = String(accounts[i]).replace(/'/g, "''");
            }
            accountString = "'" + accounts.join("','") + "'";
            
            LNSSCoreGLTrans.query(`
                SELECT
                    PERIOD_ADD(gltran_perpost, -6) AS calendarPeriod,
                    gltran_perpost AS fiscalPeriod,
                    gltran_acctnum AS code,
                    gltran_cramt AS credit,
                    gltran_dramt AS debit
                FROM
                    nss_core_gltran
                WHERE
                    gltran_perpost > ?
                    AND gltran_subacctnum IN (${accountString})
                ORDER BY
                    gltran_perpost;
            `, [startingPeriod], (err, list) => {
                if (err) {
                    reject(err);
                } 
                else {
                    var results = {};
                    
                    if (list && list[0]) {
                        list.forEach((row) => {
                            let period = row.calendarPeriod;
                            let code = row.code;
                            
                            results[period] = results[period] || {
                                fiscalPeriod: row.fiscalPeriod,
                                localIncome: 0,
                                foreignIncome: 0,
                                expenses: 0
                            };
                            
                            //// Old COA (before fiscal year 2021)
                            if (row.fiscalPeriod < 202101) {
                                // Expenses
                                if (code >= 6000 && code != 8100 && code < 8200) {
                                    results[period].expenses += row.debit - row.credit;
                                }
                                else if (code == 8100 && row.debit > 0) {
                                    results[period].expenses += row.debit;
                                }
                                
                                // Local income
                                if (code >= 4000 && code <= 4410) {
                                    results[period].localIncome += row.credit - row.debit;
                                }
                                else if (code == 8100) {
                                    results[period].localIncome += row.credit;
                                }
                                
                                // Foreign income
                                if (code >= 5000 && code <= 5780) {
                                    results[period].foreignIncome += row.credit - row.debit;
                                }
                            }
                            
                            // New COA (fiscal year 2021 and after)
                            else {
                                //// See top of file for newCOA.
                                
                                // Expenses
                                if (code == 9511 && row.debit > 0) {
                                    // local transfer out
                                    results[period].expenses += row.debit;
                                }
                                else if (newCOA.expenses.indexOf(code) >= 0) {
                                    results[period].expenses += row.debit - row.credit;
                                }
                                
                                // Local income
                                else if (code == 9111 && row.credit > 0) {
                                    // local transfer in
                                    results[period].localIncome += row.credit;
                                }
                                else if (newCOA.localIncome.indexOf(code) >= 0) {
                                    results[period].localIncome += row.credit - row.debit;
                                }
                                
                                // Foreign income
                                else if (newCOA.foreignIncome.indexOf(code) >= 0) {
                                    results[period].foreignIncome += row.credit - row.debit;
                                }
                                
                            }
                            
                        });
                    }
                    
                    resolve(results);
                }
            });
            
        });
    },
    
    
    /**
     * Fetches the sums of salary, expenditure, local & foreign income,
     * grouping by staff account number.
     *
     * Works with both the new (2021) and old COAs.
     *
     * @param {string} startingPeriod
     * @param {string} [account]
     *      Optional staff account filter.
     *
     * @return {Promise}
     *      Resolves with json object:
     *
     */
    categorizedSumsByAccount: function(startingPeriod, account) {
        account = account || '%';
        return new Promise((resolve,  reject) => {
            var finalResult = {
                salary: {},
                expenditure: {},
                localIncome: {},
                foreignIncome: {},
                income: {},
            };
            
            var expenseAccounts = [];
            
            async.series([
                (next) => {
                    // Use the 'chartofaccounts_transactiontype' column to
                    // determine whether an account is an Expense or not.
                    // This includes both new and old COAs.
                    LNSSCoreChartOfAccounts.expenseAccounts()
                    .then((list) => {
                        expenseAccounts = list;
                        next();
                    })
                    .catch(next);
                },
                
                (next) => {
                    LNSSCoreGLTrans.query(`
                        SELECT
                            gltran_dramt AS debit,
                            gltran_cramt AS credit,
                            gltran_acctnum AS account,
                            gltran_subacctnum AS subaccount,
                            gltran_perpost AS period
                        FROM
                            nss_core_gltran
                        WHERE
                            gltran_perpost > ?
                            AND gltran_subacctnum LIKE ?
                    `, [startingPeriod, account], (err, list) => {
                        if (err) next(err);
                        else {
                            list.forEach((row) => {
                                let sub = row.subaccount;
                                //// Salary
                                finalResult.salary[sub] = finalResult.salary[sub] || 0;
                                if (['7000', '7111'].indexOf(row.account) >= 0) {
                                    finalResult.salary[sub] += (row.credit - row.debit);
                                }
                                
                                //// Expenditure
                                finalResult.expenditure[sub] = finalResult.expenditure[sub] || 0;
                                // Account transfers out (no credit)
                                if (['8100', '9511'].indexOf(row.account) >= 0 && row.debit > 0) {
                                    finalResult.expenditure[sub] += row.debit;
                                }
                                // All other expenses
                                else if (expenseAccounts.indexOf(row.account) >= 0) {
                                    finalResult.expenditure[sub] += (row.debit - row.credit);
                                }
                                
                                //// All income
                                finalResult.income[sub] = finalResult.income[sub] || 0;

                                //// Foreign income
                                finalResult.foreignIncome[sub] = finalResult.foreignIncome[sub] || 0;
                                if (
                                    // Old COA
                                    (row.period < 202101 && row.account >= 5000 && row.account <= 5780) || 
                                    // New COA
                                    (row.period >= 202101 && newCOA.foreignIncome.indexOf(row.account) >= 0)
                                ) {
                                    finalResult.foreignIncome[sub] += (row.credit - row.debit);
                                    finalResult.income[sub] += (row.credit - row.debit);
                                }
 
                                //// Local income
                                finalResult.localIncome[sub] = finalResult.localIncome[sub] || 0;
                                if (
                                    // Old COA
                                    (row.period < 202101 && row.account >= 4000 && row.account <= 4410) ||
                                    // New COA
                                    (row.period >= 202101 && newCOA.localIncome.indexOf(row.account) >= 0)
                                ) {
                                    finalResult.localIncome[sub] += (row.credit - row.debit);
                                    finalResult.income[sub] += (row.credit - row.debit);
                                }
                                else if (row.period < 202101 && row.account == 8100 && row.credit > 0) {
                                    // Local inbound transfers (no debit)
                                    finalResult.localIncome[sub] += row.credit;
                                    finalResult.income[sub] += row.credit;
                                }
                            });
                            next();
                        }
                    });
                },
                
            ], (err, list) => {
                if (err) reject(err);
                else {
                    resolve(finalResult);
                }
            });
        });
    },
    
    
    
    /**
     * DEPRECATED
     * 
     * Total amount of funds leaving the account per month, over the past
     * twelve months, of each staff.
     *
     * Credits & debits are counted differently depending on the account code.
     * See Mantis #2924.
     *
     * {
     *    <staff account>: <sumExpenditure>,
     *    ...
     * }
     *
     * @param string startingPeriod
     *      The gltran_perpost period from 12 months ago.
     *      Format: YYYYMM
     * @param string account
     *      Optional. Only find staff accounts like this.
     *      Default is '%'.
     * @return Deferred
     */
    sumExpenditure: function(startingPeriod, account) {
        var dfd = AD.sal.Deferred();
        var account = account || '%';
        
        var resultsByAccount = {};
        
        var queries = [
            // Query 1: debits - credits
            // Account codes from 6000 to 8200, except for 8100
            `
                SELECT
                    gltran_subacctnum AS account,
                    SUM(gltran_dramt - gltran_cramt) AS sumExpenditure
                FROM
                    nss_core_gltran
                WHERE
                    gltran_perpost > ?
                    AND gltran_subacctnum LIKE ?
                    AND gltran_acctnum >= 6000
                    AND gltran_acctnum != 8100
                    AND gltran_acctnum < 8200
                GROUP BY
                    gltran_subacctnum
            `,
            
            // Query 2: debits only
            // Account code 8100
            `
                SELECT
                    gltran_subacctnum AS account,
                    SUM(gltran_dramt) AS sumExpenditure
                FROM
                    nss_core_gltran
                WHERE
                    gltran_perpost > ?
                    AND gltran_subacctnum LIKE ?
                    AND gltran_acctnum = 8100
                    AND gltran_dramt > 0
                GROUP BY
                    gltran_subacctnum
            `
        ];
        
        // Run both queries and group results by staff account number
        async.forEach(queries, function(sql, next) {
            LNSSCoreGLTrans
            .query(sql, [startingPeriod, account], function(err, results) {
                if (err) next(err);
                else {
                    for (var i=0; i<results.length; i++) {
                        var account = results[i].account;
                        resultsByAccount[account] = resultsByAccount[account] || 0;
                        resultsByAccount[account] += results[i].sumExpenditure;
                    }
                    next();
                }
            });
        }, function(err) {
            if (err) {
                dfd.reject(err);
            } else {
                dfd.resolve(resultsByAccount);
            }
        });
        
        return dfd;
    },
    
    
    /**
     * THIS IS NOT USED
     * Total amount of funds entering the account per month, over the past
     * twelve months, of each staff.
     *
     * Credits & debits are counted differently depending on the account code.
     * See Mantis #2924.
     *
     * {
     *    <staff account>: <sumIncome>,
     *    ...
     * }
     *
     * @param string startingPeriod
     *      The gltran_perpost period from 12 months ago.
     *      Format: YYYYMM
     * @param string account
     *      Optional. Only find staff accounts like this.
     * @return Deferred
     */
    sumIncome: function(startingPeriod, account) {
        var dfd = AD.sal.Deferred();
        var account = account || '%';
        
        var resultsByAccount = {};
        
        var queries = [
            // Query 1: credits - debits
            " \
                SELECT \
                    gltran_subacctnum AS account, \
                    SUM(gltran_cramt - gltran_cramt) AS sumIncome \
                FROM \
                    nss_core_gltran \
                WHERE \
                    gltran_perpost > ? \
                    AND gltran_subacctnum LIKE ? \
                    AND gltran_acctnum <= 5780 \
                GROUP BY \
                    gltran_subacctnum \
            ",
            
            // Query 2: credits only
            " \
                SELECT \
                    gltran_subacctnum AS account, \
                    SUM(gltran_cramt) AS sumIncome \
                FROM \
                    nss_core_gltran \
                WHERE \
                    gltran_perpost > ? \
                    AND gltran_subacctnum LIKE ? \
                    AND gltran_acctnum = 8100 \
                    AND gltran_cramt > 0 \
                GROUP BY \
                    gltran_subacctnum \
            "
        ];
        
        // Run both queries and group results by staff account number
        async.forEach(queries, function(sql, next) {
            LNSSCoreGLTrans
            .query(sql, [startingPeriod, account], function(err, results) {
                if (err) next(err);
                else {
                    for (var i=0; i<results.length; i++) {
                        var account = results[i].account;
                        resultsByAccount[account] = resultsByAccount[account] || 0;
                        resultsByAccount[account] += results[i].sumIncome;
                    }
                    next();
                }
            });
        }, function(err) {
            if (err) {
                dfd.reject(err);
            } else {
                dfd.resolve(resultsByAccount);
            }
        });
        
        return dfd;
    },
    
    
    /**
     * DEPRECATED
     *
     * The amount of funds added from local sources per month,
     * over the past twelve months, for each staff.
     *
     * Credits & debits are counted differently depending on the account code.
     * See Mantis #2924.
     *
     * {
     *    <staff account>: <sumLocalContrib>,
     *    ...
     * }
     *
     * @param string startingPeriod
     *      The gltran_perpost period from 12 months ago.
     *      Format: YYYYMM
     * @param string account
     *      Optional. Only find staff accounts like this.
     * @return Deferred
     */
    sumLocalContrib: function(startingPeriod, account) {
        var dfd = AD.sal.Deferred();
        var account = account || '%';
        
        var resultsByAccount = {};
        
        var queries = [
            // Query 1: credits - debits
            // Account codes from 4000 to 4410
            `
                SELECT
                    gltran_subacctnum AS account,
                    SUM(gltran_cramt - gltran_dramt) AS sumLocalContrib
                FROM
                    nss_core_gltran
                WHERE
                    gltran_perpost > ?
                    AND gltran_acctnum >= 4000
                    AND gltran_acctnum <= 4410
                    AND gltran_subacctnum LIKE ?
                GROUP BY
                    gltran_subacctnum
            `,
            
            // Query 2: credits only
            // Account code 8100
            `
                SELECT
                    gltran_subacctnum AS account,
                    SUM(gltran_cramt) AS sumLocalContrib
                FROM
                    nss_core_gltran
                WHERE
                    gltran_perpost > ?
                    AND gltran_acctnum IN ('8100')
                    AND gltran_subacctnum LIKE ?
                    AND gltran_cramt > 0
                GROUP BY
                    gltran_subacctnum
            `
        ];
        
        // Run both queries and group results by staff account number
        async.forEach(queries, function(sql, next) {
            LNSSCoreGLTrans
            .query(sql, [startingPeriod, account], function(err, results) {
                if (err) next(err);
                else {
                    for (var i=0; i<results.length; i++) {
                        var account = results[i].account;
                        resultsByAccount[account] = resultsByAccount[account] || 0;
                        resultsByAccount[account] += results[i].sumLocalContrib;
                    }
                    next();
                }
            });
        }, function(err) {
            if (err) {
                dfd.reject(err);
            } else {
                dfd.resolve(resultsByAccount);
            }
        });
        
        return dfd;
    },
    
    
    /**
     * DEPRECATED
     *
     * The sum amount of monthly salary over the past 12 months, for each
     * staff.
     *
     * {
     *    <staff account>: <sumSalary>,
     *    ...
     * }
     *
     * @param string startingPeriod
     *      The gltran_perpost period from 12 months ago.
     *      Format: YYYYMM
     * @param string account
     *      Optional. Only find staff accounts like this.
     *      Default is '%'.
     * @return Deferred
     */
    sumSalary: function(startingPeriod, account) {
        var dfd = AD.sal.Deferred();
        var account = account || '%';
        
        // gltran_acctnum meanings:
        //  7000 - salary, additional salary, short pay, reduce ytd salary paid
        //  1200 - deduction
        //  1250 - salary advance, clear salary advance
        //  1210 - correction to ytd salary
        // so i guess we just count the 7000 transactions?
        //  7111 - salary account under the new 2020 COA
        
        LNSSCoreGLTrans.query(`
            SELECT
                gltran_subacctnum AS account,
                SUM(gltran_cramt - gltran_dramt) AS sumSal
            FROM
                nss_core_gltran
            WHERE
                gltran_perpost > ?
                AND gltran_acctnum IN ('7000', '7111')
                AND gltran_subacctnum LIKE ?
            GROUP BY
                gltran_subacctnum
        `, [startingPeriod, account], function(err, results) {
            if (err) {
                dfd.reject(err);
            } else {
                var resultsByAccount = {};
                for (var i=0; i<results.length; i++) {
                    var account = results[i].account;
                    resultsByAccount[account] = results[i].sumSal;
                }
                dfd.resolve(resultsByAccount);
            }
        });
        
        return dfd;
    },
    
    
    /**
     * The amount of funds added from foreign sources per month,
     * over the past twelve months, for each staff.
     *
     * {
     *    <staff account>: <sumForeignContrib>,
     *    ...
     * }
     *
     * @param string startingPeriod
     *      The gltran_perpost period from 12 months ago.
     *      Format: YYYYMM
     * @param string account
     *      Optional. Only find staff accounts like this.
     * @return Deferred
     */
    sumForeignContrib: function(startingPeriod, account) {
        var dfd = AD.sal.Deferred();
        var account = account || '%';
        
        var resultsByAccount = {};
        
        var queries = [
            // Query 1: credits - debits
            // Account codes from 5000 to 5780
            `
                SELECT
                    gltran_subacctnum AS account,
                    SUM(gltran_cramt - gltran_dramt) AS sumForeignContrib
                FROM
                    nss_core_gltran
                WHERE
                    gltran_perpost > ?
                    AND gltran_acctnum >= 5000
                    AND gltran_acctnum <= 5780
                    AND gltran_subacctnum LIKE ?
                GROUP BY
                    gltran_subacctnum
            `
        ];
        
        // Run both queries and group results by staff account number
        async.forEach(queries, function(sql, next) {
            LNSSCoreGLTrans
            .query(sql, [startingPeriod, account], function(err, results) {
                if (err) next(err);
                else {
                    for (var i=0; i<results.length; i++) {
                        var account = results[i].account;
                        resultsByAccount[account] = resultsByAccount[account] || 0;
                        resultsByAccount[account] += results[i].sumForeignContrib;
                    }
                    next();
                }
            });
        }, function(err) {
            if (err) {
                dfd.reject(err);
            } else {
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
     *    <staff account>: [ <yyyymm>, ... ],
     *    ...
     * }
     *
     * @param string startingPeriod
     *      The gltran_perpost period from 12 months ago.
     *      Format: YYYYMM
     * @param string account
     *      Optional. Only find staff accounts like this.
     * @return Deferred
     */
    shortPayPeriods: function(startingPeriod, account) {
        var dfd = AD.sal.Deferred();
        var account = account || '%';
        
        LNSSCoreGLTrans.query(`
            SELECT
                gltran_subacctnum AS accountNum,
                COUNT(DISTINCT gltran_perpost) AS count,
                GROUP_CONCAT(DISTINCT gltran_perpost) AS p
            FROM
                nss_core_gltran
            WHERE
                gltran_perpost > ?
                AND gltran_acctnum IN ('7000', '7111')
                AND gltran_cramt > 0
                AND gltran_subacctnum LIKE ?
            GROUP BY
                gltran_subacctnum
        `, [startingPeriod, account], function(err, results) {
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
    },
    
    
    /**
     * Compute the number of periods between two yyyymm fiscal periods.
     *
     *      p1 - p2
     *
     * @param string p1
     * @param string p2
     * @return int
     */
    periodDiff: function(p1, p2) {
        var y1 = String(p1).substr(0, 4),
            m1 = String(p1).substr(4, 2),
            y2 = String(p2).substr(0, 4),
            m2 = String(p2).substr(4, 2);
        return ((y1 - y2) * 12) + (m1 - m2);
    }
    
    
};



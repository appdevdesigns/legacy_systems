/**
* LNSSCoreGLTrans.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var AD = require('ad-utils');

module.exports = {

    tableName: "nss_core_chartofaccounts",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    migrate:'safe',  // don't update the tables!


    connection:"legacy_stewardwise",


    attributes: {

        chartofaccounts_id : {
            type : "integer",
            size : 11,
            primaryKey : true,
            autoIncrement : true
        }, 

        chartofaccounts_accountNum : {
            type : "integer",
            size : 11,
            defaultsTo : "0"
        }, 

        chartofaccounts_description : {
            type : "text"
        }, 

        chartofaccounts_iandecategory : {
            type : "text"
        }, 

        chartofaccounts_transactiontype : {
            type : "string",
            size : "10"
        }

    },
    
    
    ////////////////////////////
    // Model class methods
    ////////////////////////////
    
    
    /**
     * Finds the account numbers that are classified as expenses.
     *
     * @param {object} [options]
     * @param {boolean} [options.excludeOldCOA]
     *      Exclude accounts from the old system pre-2021.
     *      Default is false.
     * @param {boolean} [options.excludeNewCOA]
     *      Exclude accounts from the new system starting 2021.
     *      Default is false.
     *
     * @return {Promise}
     *      Resolves with array of account numbers.
     */
    expenseAccounts: function(options={}) {
        var finalResult = [];
        
        return new Promise((resolve, reject) => {
            async.series(
                [
                    // Old COA
                    (next) => {
                        if (options.excludeOldCOA) {
                            return next();
                        }
                        
                        LNSSCoreChartOfAccounts.query(`
                            SELECT 
                                chartofaccounts_accountNum
                            FROM 
                                nss_core_chartofaccounts_old
                            WHERE
                                chartofaccounts_transactiontype LIKE 'Expense'
                        `, (err, list) => {
                            if (err) next(err);
                            else {
                                list.forEach((row) => {
                                    finalResult.push(row.chartofaccounts_accountNum);
                                });
                                next()
                            }
                        });
                    },
                    
                    // New COA
                    (next) => {
                        if (options.excludeNewCOA) {
                            return next();
                        }
                        
                        LNSSCoreChartOfAccounts.query(`
                            SELECT 
                                chartofaccounts_accountNum
                            FROM 
                                nss_core_chartofaccounts
                            WHERE
                                chartofaccounts_transactiontype LIKE 'Expense'
                        `, (err, list) => {
                            if (err) next(err);
                            else {
                                list.forEach((row) => {
                                    finalResult.push(row.chartofaccounts_accountNum);
                                });
                                next()
                            }
                        });
                    },
                ],
                (err) => {
                    if (err) reject(err);
                    else resolve(finalResult);
                }
            );
        });
    }

    
};



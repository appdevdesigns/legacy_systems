/**
* LNSSPayrollTransactions.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    // tableName:"lnss_payroll_transactions",
    tableName:"nss_payroll_transactions",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    migrate:'safe',  // don't update the tables!



    connection:"legacy_stewardwise",
// connection:"nss",



    attributes: {

        nsstransaction_id : {
            type : "integer",
            size : 11,
            primaryKey : true,
            autoIncrement : true
        }, 

        nssren_id : {
            type : "integer",
            size : 11,
            defaultsTo : "0"
        }, 

        nsstransaction_baseSalary : {
            type : "float",
            defaultsTo : "0"
        }, 

        nsstransaction_allowance : {
            type : "float",
            defaultsTo : "0"
        }, 

        nsstransaction_deduction : {
            type : "float",
            defaultsTo : "0"
        }, 

        nsstransaction_totalSalary : {
            type : "float",
            defaultsTo : "0"
        }, 

        nsstransaction_date : {
            type : "date",
            defaultsTo : "0000-00-00"
        }, 

        requestcutoff_id : {
            type : "integer",
            size : 6,
            defaultsTo : "0"
        }, 

        nsstransaction_processedBy : {
            type : "string",
            size : 64
        }, 

        nsstransaction_territory_id : {
            type : "integer",
            size : 11,
            defaultsTo : "0"
        }, 

        glbatch_id : {
            type : "integer",
            size : 11,
            defaultsTo : "0"
        }, 


    }
};


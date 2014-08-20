/**
* LNSSCoreFiscalPeriod.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    // tableName:"lnss_core_fiscalperiod",
    tableName:"nss_core_fiscalperiod",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    // migrate:'safe',  // don't update the tables!



    connection:"legacy_stewardwise",
// connection:"nss",



    attributes: {

        requestcutoff_id : {
            type : "integer",
            size : 11,
            primaryKey : true,
            autoIncrement : true
        }, 

        requestcutoff_year : {
            type : "integer",
            size : 6,
            defaultsTo : "0"
        }, 

        requestcutoff_period : {
            type : "integer",
            size : 6,
            defaultsTo : "0"
        }, 

        requestcutoff_date : {
            type : "date",
            defaultsTo : "0000-00-00"
        }, 

        requestcutoff_isClosed : {
            type : "integer",
            size : 2,
            defaultsTo : "0"
        }, 

    }
};


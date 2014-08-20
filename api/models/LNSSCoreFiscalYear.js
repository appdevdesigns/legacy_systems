/**
* LNSSCoreFiscalYear.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    // tableName:"lnss_core_fiscalyear",
    tableName:"nss_core_fiscalyear",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    // migrate:'safe',  // don't update the tables!



    connection:"legacy_stewardwise",
// connection:"nss",



    attributes: {

        fiscalyear_id : {
            type : "integer",
            size : 11,
            primaryKey : true,
            autoIncrement : true
        }, 

        fiscalyear_start : {
            type : "date",
            defaultsTo : "0000-00-00"
        }, 

        fiscalyear_end : {
            type : "date",
            defaultsTo : "0000-00-00"
        }, 

        fiscalyear_glprefix : {
            type : "string",
            size : 16
        }, 


    }
};


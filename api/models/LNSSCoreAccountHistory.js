/**
* LNSSCoreAccountHistory.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    // tableName:"lnss_core_accounthistory",
    tableName:"nss_core_accounthistory",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    // migrate:'safe',  // don't update the tables!



    connection:"legacy_stewardwise",
// connection:"nss",    



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


    }
};


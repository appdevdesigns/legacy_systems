/**
* LNSSCoreNSCTerritory.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    // tableName:"lnss_core_nscterritory",
    tableName:"nss_core_nscterritory",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    // migrate:'safe',  // don't update the tables!



    connection:"legacy_stewardwise",
// connection:"nss",



    attributes: {

        coverage_id : {
            type : "integer",
            size : 11,
            primaryKey : true,
            autoIncrement : true
        }, 

        nsc_id : {
            type : "integer",
            size : 11,
            defaultsTo : "0"
        }, 

        territory_id : {
            type : "integer",
            size : 11,
            defaultsTo : "0"
        }, 


    }
};


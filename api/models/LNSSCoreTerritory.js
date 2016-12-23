/**
* LNSSCoreTerritory.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    // tableName:"lnss_core_territory",
    tableName:"nss_core_territory",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    migrate:'safe',  // don't update the tables!



    connection:"legacy_stewardwise",
// connection:"nss",



    attributes: {

        territory_id : {
            type : "integer",
            size : 11,
            primaryKey : true,
            autoIncrement : true
        }, 

        territory_cola : {
            type : "float",
            defaultsTo : "1"
        }, 

        territory_GLCode : {
            type : "string",
            size : 16
        }, 

        territory_desc : {
            type : "string",
            size : 50
        },


    }
};


/**
* LNSSRenTerritory.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    tableName:"nss_core_renterritory",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    // migrate:'safe',  // don't update the tables!



    connection:"legacy_stewardwise",
// connection:"nss",



    attributes: {

        renterritory_id : {
            type : "integer",
            size : 11,
            primaryKey : true,
            autoIncrement : true
        },
        
        renterritory_type : {
            type: "integer",
            size: 1,
            default: 1
        },

        territory_id : {
            model: 'LNSSCoreTerritory'
        }, 
        
        nssren_id : {
            model: 'LNSSRen',
        }

    }
};


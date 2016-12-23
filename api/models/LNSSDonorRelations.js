/**
* LNSSDonors.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    tableName:"nss_don_donorrelations",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    migrate:'safe',  // don't update the tables!



    connection:"legacy_stewardwise",



    attributes: {

        donorrelation_id : {
            type : "integer",
            size : 11,
            primaryKey : true,
            autoIncrement : true
        }, 
        
        donor_id: {
            model: 'LNSSDonors'
        },
        
        nssren_id: {
            model: 'LNSSRen'
        },
        
        donors_isActive: {
            type: "integer",
            size: 2,
            defaultsTo: 1
        }
        
    }
};


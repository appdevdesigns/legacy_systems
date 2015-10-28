/**
* LNSSDonItem.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    tableName:"nss_don_donItem",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    // migrate:'safe',  // don't update the tables!



    connection:"legacy_stewardwise",



    attributes: {

        donItem_id : {
            type : "integer",
            size : 11,
            primaryKey : true,
            autoIncrement : true
        }, 
        
        /*
        donBatch_id : {
            type : "integer",
            size : 11,
        }, 
        */
        donBatch_id: {
            model: 'LNSSDonBatch'
        },
        
        donItem_dateReceived: {
            type: 'date',
            defaultsTo: '0000-00-00'
        },
        
        donItem_amount: {
            type: 'float',
            defaultsTo: 0
        },
        
        donItem_type: {
            type: 'integer',
            size: 3
        },
        
        donor_id: {
            model: 'LNSSDonors'
        },
        
        donItem_description: {
            type: 'string',
            size: 80
        }

    }
};


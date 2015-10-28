/**
* LNSSDonBatch.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    // tableName:"lnss_don_donBatch",
    tableName:"nss_don_donBatch",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    // migrate:'safe',  // don't update the tables!



    connection:"legacy_stewardwise",
// connection:"nss",



    attributes: {

        donBatch_id : {
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

        ren_id : {
            type : "integer",
            size : 11,
            defaultsTo : "0"
        }, 

        donBatch_dateCreated : {
            type : "date",
            defaultsTo : "0000-00-00"
        }, 

        donBatch_dateProcessed : {
            type : "date",
            defaultsTo : "0000-00-00",
            required:false
        }, 

        donBatch_nscName : {
            type : "string",
            size : 25
        }, 

        nsc_territory_id : {
            type : "integer",
            size : 11,
            defaultsTo : "0"
        }, 

        donBatch_amount : {
            type : "float",
            defaultsTo : "0"
        }, 

        donBatch_fee : {
            type : "float",
            defaultsTo : "0"
        }, 

        donBatch_status : {
            type : "string",
            size : 25
        }, 

        glbatch_id : {
            type : "integer",
            size : 11,
            defaultsTo : "0"
        }, 

        donBatch_lock : {
            type : "integer",
            size : 11,
            defaultsTo : "0"
        }, 
        
        donItems: {
            collection: 'LNSSDonItem',
            via: 'donBatch_id'
        }


    }
};


/**
* LHRISEmail.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    // tableName:"lhris_email",
    tableName:"hris_email",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    migrate:'safe',  // don't update the tables!



    connection:"legacy_hris",
// connection:"hris",



    attributes: {

        email_id : {
            type : "integer",
            size : 11,
            primaryKey : true,
            autoIncrement : true
        }, 

        email_guid : {
            type : "string",
            size : 45
        }, 

        ren_id : {
            model:'LHRISRen'
        }, 

        email_issecure : {
            type : "integer",
            size : 1,
            defaultsTo : "0"
        }, 

        email_address : {
            type : "string",
            size : 64,
            defaultsTo : "-"
        }, 


    }
};


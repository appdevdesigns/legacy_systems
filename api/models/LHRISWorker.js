/**
* LHRISWorker.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    // tableName:"lhris_account",
    tableName:"hris_worker",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    migrate:'safe',  // don't update the tables!


    connection:"legacy_hris",
// connection:"hris",


    attributes: {

        worker_id : {
            type : "integer",
            size : 11,
            primaryKey : true,
            autoIncrement : true
        }, 

        worker_guid : {
            type : "string",
            size : 45
        }, 

        ren_id : {
            model: 'LHRISRen'
        }, 

        account_id : {
            model: 'LHRISAccount'
        }


    }
};


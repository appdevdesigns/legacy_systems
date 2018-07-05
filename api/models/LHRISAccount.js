/**
* LHRISAccount.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    tableName:"hris_account",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    migrate:'safe',  // don't update the tables!


    connection:"legacy_hris",


    attributes: {

        id : {
            columnName: 'account_id',
            type : "integer",
            size : 11,
            primaryKey : true,
            autoIncrement : true
        }, 

        account_guid : {
            type : "string",
            size : 45
        }, 

        family_id : {
            model: 'LHRISFamily'
        }, 

        account_number : {
            type : "string",
            size : 45
        }, 

        country_id : {
            model: 'LHRISCountry'
        }, 
        
        "worker": {
            collection: "LHRISWorker",
            via: "account_id"
        },

        account_isprimary : {
            type : "integer",
            size : 1,
            defaultsTo : "1"
        }


    }
};


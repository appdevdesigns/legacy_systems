/**
* LHRISFamily.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    tableName:"hris_family",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    migrate:'safe',  // don't update the tables!



    connection:"legacy_hris",



    attributes: {

        'id' : {
            columnName: 'family_id',
            type : "integer",
            size : 11,
            primaryKey : true,
            autoIncrement : true
        }, 

        family_guid : {
            type : "string",
            size : 45
        }, 

        family_anniversary : {
            type : "date",
            defaultsTo : "1111-11-11",
            required:false
        }, 

        family_isregwithembassy : {
            type : "integer",
            size : 1,
            defaultsTo : "0"
        }, 

        family_numberchildren : {
            type : "integer",
            size : 11,
            defaultsTo : "0"
        },

        members: {
            collection: 'LHRISRen',
            via: 'family_id'
        },

        "address_record": {
            collection: "LHRISAddress",
            via: "family_id"
        },

        accounts: {
            collection: 'LHRISAccount',
            via: 'family_id'
        }

    }
};


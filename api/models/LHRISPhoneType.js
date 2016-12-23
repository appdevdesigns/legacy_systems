/**
* LHRISPhoneType.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    // tableName:"lhris_phonetype_data",
    tableName:"hris_phonetype_data",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    migrate:'safe',  // don't update the tables!



    connection:"legacy_hris",
// connection:"hris",



    attributes: {

        phonetype_id : {
            type : "integer",
            size : 11,
            primaryKey : true,
            autoIncrement : true
        }, 

        is_protected : {
            type : "integer",
            size : 1,
            defaultsTo : "0"
        }, 

        translations:{
            collection:'LHRISPhoneTypeTrans',
            via:'phonetype_id'
        }


    }
};


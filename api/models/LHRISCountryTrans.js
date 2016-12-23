/**
* LHRISCountryTrans.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    // tableName:"lhris_country_trans",
    tableName:"hris_country_trans",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    migrate:'safe',  // don't update the tables!


    connection:"legacy_hris",
// connection:"hris",


    attributes: {

        Trans_id : {
            type : "integer",
            size : 11,
            primaryKey : true,
            autoIncrement : true
        }, 

        country_id : {
            model:'LHRISCountry'
        }, 

        language_code : {
            type : "string",
            size : 10,
            defaultsTo : "-"
        }, 

        country_label : {
            type : "string",
            size : 64
        }


    }
};


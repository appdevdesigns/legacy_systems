/**
* LHRISCountry.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    // tableName:"lhris_country_data",
    tableName:"hris_country_data",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    migrate:'safe',  // don't update the tables!


    connection:"legacy_hris",
// connection:"hris",


    attributes: {

        country_id : {
            type : "integer",
            size : 11,
            primaryKey : true,
            autoIncrement : true
        }, 

        country_code : {
            type : "string",
            size : 2
        }, 

        country_callingcode : {
            type : "string",
            size : 10,
            defaultsTo : "-"
        }, 

        country_weight : {
            type : "integer",
            size : 11,
            defaultsTo : "0"
        },

        translations: {
            collection:'LHRISCountryTrans',
            via:'country_id'
        }


    }
};


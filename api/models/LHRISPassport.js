/**
 * LHRISPassport.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_passport',


  connection:'legacy_hris',



  attributes: {

    "passport_id" : {
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "passport_guid" : {
        type : "string",
        size : 45
    }, 

    "ren_id" : {
        model: 'LHRISRen'
    }, 

    "passport_number" : {
        type : "string",
        size : 50,
        defaultsTo : "-"
    }, 

    "country_id" : {
        model: 'LHRISCountry'
    }, 

    "passport_issuedate" : {
        type : "date",
        defaultsTo : "1000-01-01"
    }, 

    "passport_expirationdate" : {
        type : "date",
        defaultsTo : "1000-01-01"
    }, 
    
    visas: {
        collection: 'LHRISPassportVisa',
        via: 'passport_id'
    }


  }
};


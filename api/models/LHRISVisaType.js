/**
 * LHRISVisaType.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_visatype_data',


  connection:'legacy_hris',



  attributes: {

    'id' : {
        columnName: "visatype_id",
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "is_protected" : {
        type : "integer",
        size : 1,
        defaultsTo : "0"
    }, 

    "country_id" : {
        model: 'LHRISCountry'
    }, 
    
    passport_visa: {
        collection: "LHRISPassportVisa",
        via: "visatype_id"
    },
    
    translations: {
        collection: 'LHRISVisaTypeTrans',
        via: 'visatype_id'
    }


  }
};


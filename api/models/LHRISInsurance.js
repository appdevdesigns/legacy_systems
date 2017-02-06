/**
 * LHRISInsurance.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_insurance',


  connection:'legacy_hris',



  attributes: {

    'id' : {
        columnName: "insurance_id",
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "insurance_guid" : {
        type : "string",
        size : 45
    }, 

    "family_id" : {
        model: 'LHRISFamily'
    }, 

    "insurancetype_id" : {
        model: 'LHRISInsuranceType'
    }, 

    "insurance_providername" : {
        type : "string",
        size : 100
    }, 

    "insurance_providerphone" : {
        type : "string",
        size : 32
    }, 

    "insurance_policynumber" : {
        type : "string",
        size : 64
    }, 

    "insurance_effectivedate" : {
        type : "date"
    }, 

    "insurance_expirationdate" : {
        type : "date"
    }, 

    "insurance_contactname" : {
        type : "string",
        size : 100
    }, 

    "insurance_contactphone" : {
        type : "string",
        size : 32
    }, 


  }
};


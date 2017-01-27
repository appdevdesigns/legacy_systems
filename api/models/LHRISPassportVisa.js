/**
 * LHRISPassprtVisa.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_passportvisa',


  connection:'legacy_hris',



  attributes: {

    "rpv_id" : {
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "rpv_guid" : {
        type : "string",
        size : 45
    }, 

    "visatype_id" : {
        model: 'LHRISVisaType'
    }, 

    "passport_id" : {
        model: 'LHRISPassport'
    }, 

    "rpv_visaexpirationdate" : {
        type : "date",
        defaultsTo : "1000-01-01"
    }, 


  }
};


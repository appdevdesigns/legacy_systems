/**
 * LHRISEmergencyContactTrans.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_emergencycontact_trans',


  connection:'legacy_hris',



  attributes: {

    'id' : {
        columnName: "Trans_id",
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "ec_id" : {
        model: 'LHRISEmergencyContact'
    }, 

    "language_code" : {
        type : "string",
        size : 10,
        defaultsTo : "-"
    }, 

    "ec_address" : {
        type : "text"
    }, 

    "ec_specialinstructions" : {
        type : "text"
    }, 

    "ec_languagesspoken" : {
        type : "text"
    }, 


  }
};


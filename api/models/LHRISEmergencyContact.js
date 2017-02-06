/**
 * LHRISEmergencyContact.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_emergencycontact_data',


  connection:'legacy_hris',



  attributes: {

    'id' : {
        columnName: "ec_id",
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "ec_guid" : {
        type : "string",
        size : 45
    }, 

    "family_id" : {
        model: 'LHRISFamily'
    }, 

    "ec_name" : {
        type : "string",
        size : 128
    }, 

    "relationship_id" : {
        model: 'LHRISRelationship'
    }, 

    "ec_phone1_type" : {
        model: 'LHRISPhoneType'
    }, 

    "ec_phone1" : {
        type : "string",
        size : 20,
        defaultsTo : "-"
    }, 

    "ec_phone2_type" : {
        model: 'LHRISPhoneType'
    }, 

    "ec_phone2" : {
        type : "string",
        size : 20,
        defaultsTo : "-"
    }, 

    "ec_email" : {
        type : "string",
        size : 64,
        defaultsTo : "-"
    }, 

    "attitude_id" : {
        model: 'LHRISAttitude'
    }, 
    
    translations: {
        collection: 'LHRISEmergencyContactTrans',
        via: 'ec_id'
    }


  }
};


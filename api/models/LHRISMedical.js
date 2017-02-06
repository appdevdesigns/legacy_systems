/**
 * LHRISMedical.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_medical_data',


  connection:'legacy_hris',



  attributes: {

    'id' : {
        columnName: "medical_id",
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "medical_guid" : {
        type : "string",
        size : 45
    }, 

    "ren_id" : {
        model: 'LHRISRen'
    }, 

    "bloodtype_id" : {
        model: 'LHRISBloodType'
    }, 
    
    translations: {
        collection: 'LHRISMedicalTrans',
        via: 'medical_id'
    }


  }
};


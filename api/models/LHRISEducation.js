/**
 * LHRISEducation.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_education_data',


  connection:'legacy_hris',



  attributes: {

    'id' : {
        columnName: "education_id",
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "education_guid" : {
        type : "string",
        size : 45
    }, 

    "ren_id" : {
        model: 'LHRISRen'
    }, 

    "degree_id" : {
        model: 'LHRISDegree'
    }, 

    "educationmajor_id" : {
        model: 'LHRISEducationMajor'
    }, 

    "education_gradyr" : {
        type : "integer",
        size : 11
    }, 
    
    translations: {
        collection: 'LHRISEducationTrans',
        via: 'education_id'
    }


  }
};


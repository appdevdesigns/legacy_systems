/**
 * LHRISTraining.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_training',


  connection:'legacy_hris',



  attributes: {

    "training_id" : {
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "training_guid" : {
        type : "string",
        size : 45
    }, 

    "ren_id" : {
        model: 'LHRISRen'
    }, 

    "course_id" : {
        model: 'LHRISTrainingCourse',
    }, 

    "training_startdate" : {
        type : "date",
        defaultsTo : "1000-01-01"
    }, 

    "training_completiondate" : {
        type : "date",
        defaultsTo : "1000-01-01"
    }, 


  }
};


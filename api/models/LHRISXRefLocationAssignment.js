/**
 * LHRISXRefLocationAssignment.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_xref_location_assignment',


  connection:'legacy_hris',



  attributes: {

    "al_id" : {
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "al_guid" : {
        type : "string",
        size : 45
    }, 

    "assignment_id" : {
        model: 'LHRISAssignment'
    }, 

    "location_id" : {
        model: 'LHRISAssignLocation'
    }, 


  }
};


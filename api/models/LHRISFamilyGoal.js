/**
 * LHRISFamilyGoal.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_familyGoal',


  connection:'legacy_hris',



  attributes: {

    'id' : {
        columnName: "goal_id",
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "family_id" : {
        model: 'LHRISFamily'
    }, 

    "goal_mpd" : {
        type : "integer",
        size : 11,
        defaultsTo : "0"
    }, 


  }
};


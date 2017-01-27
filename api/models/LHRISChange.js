/**
 * LHRISChange.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_change',


  connection:'legacy_hris',



  attributes: {

    "change_id" : {
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "dbfield_id" : {
        model: 'LHRISPermDBField'
    }, 

    "change_previous_value" : {
        type : "text"
    }, 

    "change_new_value" : {
        type : "text"
    }, 

    "changegroup_id" : {
        model: 'LHRISChangeGroup'
    }, 

    "change_primary_key_value" : {
        type : "integer",
        size : 11
    }, 


  }
};


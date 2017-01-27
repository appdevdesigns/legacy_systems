/**
 * LHRISChangeGroup.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_changegroup',


  connection:'legacy_hris',



  attributes: {

    "changegroup_id" : {
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "changegroup_timestamp" : {
        type : "datetime",
        defaultsTo : "1000-01-01 00:00:00"
    }, 

    "changegroup_requester_id" : {
        model: 'LHRISRen'
    }, 

    "changegroup_approver_id" : {
        model: 'LHRISRen'
    }, 

    "ren_id" : {
        model: 'LHRISRen'
    }, 

    "family_id" : {
        model: 'LHRISFamily'
    }, 

    "changegroup_changetype" : {
        type : "string",
        size : 32
    }, 

    "changegroup_status" : {
        type : "string",
        size : 32
    }, 

    "changegroup_comment" : {
        type : "text"
    }, 

    "changegroup_resolution_timestamp" : {
        type : "datetime",
        defaultsTo : "1000-01-01 00:00:00"
    }, 
    
    changes: {
        collection: 'LHRISChange',
        via: 'changegroup_id'
    }


  }
};


/**
 * LHRISAssignPosition.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_assign_position_data',


  connection:'legacy_hris',



  attributes: {

    'id' : {
        columnName: "position_id",
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "is_protected" : {
        type : "integer",
        size : 1,
        defaultsTo : "0"
    }, 

    "parent_id" : {
        model: 'LHRISAssignPosition'
    }, 
    
    children: {
        collection: 'LHRISAssignPosition',
        via: 'parent_id'
    },

    "position_guid" : {
        type : "string",
        size : 45
    }, 

    "position_weight" : {
        type : "integer",
        size : 11,
        defaultsTo : "0"
    },
    
    assignment: {
        collection: 'LHRISAssignment',
        via: 'position_id'
    }, 
    
    translations: {
        collection: 'LHRISAssignPositionTrans',
        via: 'position_id'
    }


  }
};


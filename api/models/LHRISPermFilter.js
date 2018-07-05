/**
 * LHRISPermFilter.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_perm_filter_data',


  connection:'legacy_hris',



  attributes: {

    'id' : {
        columnName: "filter_id",
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "filter_type" : {
        type : "string",
        size : 10,
        defaultsTo : "perm"
    }, 

    "filter_condition" : {
        type : "text"
    }, 

    "filter_parsedcondition" : {
        type : "text"
    }, 
    
    "xref_perm_filter": {
        collection: "LHRISXRefPermRenFilter",
        via: "filter_id"
    },
    
    "xref_perm_role": {
        collection: "LHRISXRefPermRoleFilterAccess",
        via: "filter_id"
    },
    
    translations: {
        collection: 'LHRISPermFilterTrans',
        via: 'filter_id'
    }


  }
};


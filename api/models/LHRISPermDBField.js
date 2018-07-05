/**
 * LHRISPermDBField.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_perm_dbfield',


  connection:'legacy_hris',



  attributes: {

    'id' : {
        columnName: "dbfield_id",
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "dbfield_rowmgr" : {
        type : "string",
        size : 45
    }, 

    "dbfield_name" : {
        type : "string",
        size : 45
    }, 

    "dbfield_path" : {
        type : "text"
    }, 

    "dbfield_defaultoptiontype" : {
        type : "integer",
        size : 11,
        defaultsTo : "1"
    }, 

    "dbfield_isprimarykey" : {
        type : "integer",
        size : 4,
        defaultsTo : "0"
    }, 
    
    "change": {
        collection: "LHRISChange",
        via: "dbfield_id"
    },
    
    xref_role_option: {
        collection: "LHRISXRefPermDbfieldRoleOptionType",
        via: "dbfield_id" 
    }


  }
};


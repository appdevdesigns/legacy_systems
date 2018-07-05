/**
 * LHRISPermRole.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_perm_role_data',


  connection:'legacy_hris',



  attributes: {

    'id' : {
        columnName: "role_id",
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 
    
    xref_role_option: {
        collection: "LHRISXRefPermDbfieldRoleOptionType",
        via: "role_id"
    },
    
    xref_role_filter: {
        collection: "LHRISXRefPermRoleFilterAccess",
        via: "role_id"
    },
    
    xref_report_role: {
        collection: "LHRISXRefReportRole",
        via: "role_id"
    },
    
    translations: {
        collection: 'LHRISPermRoleTrans',
        via: 'role_id'
    },
    
    actions: {
        collection: 'LHRISPermRoleAction',
        via: 'role_id'
    }


  }
};


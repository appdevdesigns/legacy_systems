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

    "role_id" : {
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
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


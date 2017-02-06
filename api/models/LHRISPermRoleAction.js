/**
 * LHRISPermRoleAction.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_perm_roleaction',


  connection:'legacy_hris',



  attributes: {

    'id' : {
        columnName: "roleaction_id",
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "role_id" : {
        model: 'LHRISPermRole'
    }, 

    "action_key" : {
        type : "text"
    }, 


  }
};


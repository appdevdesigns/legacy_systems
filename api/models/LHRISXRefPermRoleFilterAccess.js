/**
 * LHRISXRefPermRoleFilterAccess.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_xref_perm_role_filter_access',


  connection:'legacy_hris',



  attributes: {

    'id' : {
        columnName: "rfa_id",
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "access_id" : {
        model: 'LHRISPermAccess'
    }, 

    "role_id" : {
        model: 'LHRISPermRole'
    }, 

    "filter_id" : {
        model: 'LHRISPermFilter'
    }, 


  }
};


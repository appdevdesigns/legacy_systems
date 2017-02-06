/**
 * LHRISXRefPermDbfieldRoleOptionType.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_xref_perm_dbfield_role_optiontype',


  connection:'legacy_hris',



  attributes: {

    'id' : {
        columnName: "dro_id",
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "dbfield_id" : {
        model: 'LHRISPermDBField'
    }, 

    "role_id" : {
        model: 'LHRISPermRole'
    }, 

    "optiontype_id" : {
        model: 'LHRISPermOptionType'
    }, 


  }
};


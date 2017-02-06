/**
 * LHRISPermOptionType.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_perm_optiontype_data',


  connection:'legacy_hris',



  attributes: {

    'id' : {
        columnName: "optiontype_id",
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

    "optiontype_scope" : {
        type : "string",
        size : 45
    }, 
    
    translations: {
        collection: 'LHRISPermOptionTypeTrans',
        via: 'optiontype_id'
    }


  }
};


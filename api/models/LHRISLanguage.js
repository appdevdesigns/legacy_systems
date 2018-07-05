/**
 * LHRISLanguage.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_language_data',


  connection:'legacy_hris',



  attributes: {

    'id' : {
        columnName: "language_id",
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

    "language_i18n" : {
        type : "string",
        size : 8
    }, 

    "language_weight" : {
        type : "integer",
        size : 11,
        defaultsTo : "0"
    }, 
    
    "people": {
        collection: "LHRISRen",
        via: "ren_preferredlang"
    },
    
    "xref_language_proficiency": {
        collection: "LHRISXRefRenLanguageProficiency",
        via: "language_id"
    },

    translations: {
        collection: 'LHRISLanguageTrans',
        via: 'language_id'
    }


  }
};


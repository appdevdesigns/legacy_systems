/**
 * LHRISXRefRenLanguageProficiency.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_xref_ren_language_proficiency',


  connection:'legacy_hris',



  attributes: {

    'id' : {
        columnName: "rlp_id",
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "rlp_guid" : {
        type : "string",
        size : 45
    }, 

    "ren_id" : {
        model: 'LHRISRen'
    }, 

    "language_id" : {
        model: 'LHRISLanguage'
    }, 

    "proficiency_id" : {
        model: 'LHRISProficiency'
    }, 


  }
};


/**
 * LHRISRenStatusTypeTrans.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_ren_statustype_trans',


  connection:'legacy_hris',



  attributes: {

    'id' : {
        columnName: "Trans_id",
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "statustype_id" : {
        model: 'LHRISRenStatusType'
    }, 

    "language_code" : {
        type : "string",
        size : 10,
        defaultsTo : "-"
    }, 

    "statustype_label" : {
        type : "string",
        size : 64
    }, 

    "statustype_description" : {
        type : "text"
    }, 


  }
};


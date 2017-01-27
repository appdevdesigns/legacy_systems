/**
 * LHRISRenTypeTrans.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_rentype_trans',


  connection:'legacy_hris',



  attributes: {

    "Trans_id" : {
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "rentype_id" : {
        model: 'LHRISRenType'
    }, 

    "language_code" : {
        type : "string",
        size : 10,
        defaultsTo : "-"
    }, 

    "rentype_label" : {
        type : "string",
        size : 64
    }, 

    "rentype_description" : {
        type : "text"
    }, 


  }
};


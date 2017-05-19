/**
 * LHRISFundingSourceTrans.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_fundingsource_trans',


  connection:'legacy_hris',



  attributes: {

    'id' : {
        columnName: "Trans_id",
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "fundingsource_id" : {
        model: 'LHRISFundingSource'
    }, 

    "language_code" : {
        type : "string",
        size : 10,
        defaultsTo : "-"
    }, 

    "fundingsource_label" : {
        type : "string",
        size : 64
    }, 

    "fundingsource_description" : {
        type : "text"
    }, 


  }
};

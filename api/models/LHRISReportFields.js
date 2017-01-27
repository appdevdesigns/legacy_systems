/**
 * LHRISReportFields.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_report_fields',


  connection:'legacy_hris',



  attributes: {

    "reportfield_id" : {
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "report_id" : {
        model: 'LHRISReport'
    }, 

    "reportfield_weight" : {
        type : "integer",
        size : 4
    }, 

    "reportfield_type" : {
        type : "string",
        size : 64,
        defaultsTo : "FIELD"
    }, 

    "reportfield_name" : {
        type : "string",
        size : 64
    }, 

    "searchablefields_id" : {
        type : "integer",
        size : 11
    }, 


  }
};


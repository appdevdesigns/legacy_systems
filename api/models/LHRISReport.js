/**
 * LHRISReport.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_report',


  connection:'legacy_hris',



  attributes: {

    'id' : {
        columnName: "report_id",
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "report_name" : {
        type : "text"
    }, 

    "report_type" : {
        type : "string",
        size : 64,
        defaultsTo : "PERSONNEL"
    }, 

    "ren_id" : {
        model: 'LHRISRen'
    }, 

    "report_view" : {
        type : "string",
        size : 64,
        defaultsTo : "HTML"
    }, 

    "report_shareable" : {
        type : "integer",
        size : 3,
        defaultsTo : "0"
    }, 

    "filter_id" : {
        collection: 'LHRISPermFilter'
    }, 

    "report_includefamily" : {
        type : "integer",
        size : 3,
        defaultsTo : "0"
    }, 

    "report_oneline" : {
        type : "integer",
        size : 3,
        defaultsTo : "0"
    }, 

    "report_othersedit" : {
        type : "integer",
        size : 3,
        defaultsTo : "0"
    }, 
    
    "report_fields": {
        collection: "LHRISReportFields",
        via: "report_id"
    },
    
    "report_weight": {
        collection: "LHRISReportWeight",
        via: "report_id"
    },
    
    "xref_report_role": {
        collection: "LHRISXRefReportRole",
        via: "report_id"
    },


  }
};


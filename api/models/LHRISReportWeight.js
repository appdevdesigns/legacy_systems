/**
 * LHRISReportWeight.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_reportweight',


  connection:'legacy_hris',



  attributes: {

    "reportweight_id" : {
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "report_id" : {
        model: 'LHRISReport'
    }, 

    "ren_id" : {
        model: 'LHRISRen'
    }, 

    "reportweight_value" : {
        type : "integer",
        size : 11
    }, 


  }
};


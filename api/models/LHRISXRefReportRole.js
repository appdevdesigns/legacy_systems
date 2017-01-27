/**
 * LHRISXRefReportRole.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_xref_reportrole',


  connection:'legacy_hris',



  attributes: {

    "rr_id" : {
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "report_id" : {
        model: 'LHRISReport'
    }, 

    "role_id" : {
        model: 'LHRISPermRole'
    }, 


  }
};


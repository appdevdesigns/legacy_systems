/**
 * LHRISToolsMarriageRequest.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_tools_marriagerequest',


  connection:'legacy_hris',



  attributes: {

    'id' : {
        columnName: "marriagerequest_id",
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "marriagerequest_requestorrenid" : {
        model: 'LHRISRen'
    }, 

    "marriagerequest_joineerenid" : {
        model: 'LHRISRen'
    }, 

    "marriagerequest_date" : {
        type : "date",
        defaultsTo : "1000-01-01"
    }, 

    "marriagerequest_status" : {
        type : "string",
        size : 45,
        defaultsTo : "PendingHR"
    }, 

    "marriagerequest_reqaccount" : {
        type : "string",
        size : 45
    }, 

    "marriagerequest_joinaccount" : {
        type : "string",
        size : 45
    }, 


  }
};


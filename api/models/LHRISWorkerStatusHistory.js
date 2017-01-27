/**
 * LHRISWorkerStatusHisotry.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_worker_statushistory',


  connection:'legacy_hris',



  attributes: {

    "sh_id" : {
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "sh_guid" : {
        type : "string",
        size : 45
    }, 

    "worker_id" : {
        model: 'LHRISWorker'
    }, 

    "statustype_id" : {
        model: 'LHRISWorkerStatusType'
    }, 

    "sh_time" : {
        type : "datetime"
    }, 


  }
};


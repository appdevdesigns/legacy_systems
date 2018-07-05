/**
 * LHRISWorkerStatusType.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_worker_statustype_data',


  connection:'legacy_hris',



  attributes: {

    'id' : {
        columnName: "statustype_id",
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "is_protected" : {
        type : "integer",
        size : 1,
        defaultsTo : "0"
    }, 
    
    "worker": {
        collection: "LHRISWorker",
        via: "statustype_id"
    },
    
    "status_history": {
        collection: "LHRISWorkerStatusHistory",
        via: "statustype_id"
    },
    
    translations: {
        collection: 'LHRISWorkerStatusTypeTrans',
        via: 'statustype_id'
    }


  }
};


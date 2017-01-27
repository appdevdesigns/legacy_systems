/**
 * LHRISWorkerPaysysTrans.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_worker_paysys_trans',


  connection:'legacy_hris',



  attributes: {

    "Trans_id" : {
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "paysys_id" : {
        model: 'LHRISWorkerPaysys'
    }, 

    "language_code" : {
        type : "string",
        size : 10,
        defaultsTo : "-"
    }, 

    "paysys_label" : {
        type : "string",
        size : 64
    }, 

    "paysys_description" : {
        type : "text"
    }, 


  }
};


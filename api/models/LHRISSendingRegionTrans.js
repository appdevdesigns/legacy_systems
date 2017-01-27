/**
 * LHRISSendingRegionTrans.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_sendingregion_trans',


  connection:'legacy_hris',



  attributes: {

    "Trans_id" : {
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "sendingregion_id" : {
        model: 'LHRISSendingRegion'
    }, 

    "language_code" : {
        type : "string",
        size : 10,
        defaultsTo : "-"
    }, 

    "sendingregion_label" : {
        type : "string",
        size : 64
    }, 


  }
};


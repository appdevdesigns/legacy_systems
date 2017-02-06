/**
 * LHRISPermFilterTrans.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_perm_filter_trans',


  connection:'legacy_hris',



  attributes: {

    'id' : {
        columnName: "Trans_id",
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "filter_id" : {
        model: 'LHRISPermFilter'
    }, 

    "language_code" : {
        type : "string",
        size : 10,
        defaultsTo : "-"
    }, 

    "filter_label" : {
        type : "text"
    }, 


  }
};


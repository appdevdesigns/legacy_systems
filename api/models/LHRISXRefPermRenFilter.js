/**
 * LHRISXRefPermRenFilter.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_xref_perm_ren_filter',


  connection:'legacy_hris',



  attributes: {

    "rf_id" : {
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "ren_id" : {
        model: 'LHRISRen'
    }, 

    "filter_id" : {
        model: 'LHRISPermFilter'
    }, 


  }
};


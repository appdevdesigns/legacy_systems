/**
 * LHRISVersion.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_version_data',


  connection:'legacy_hris',



  attributes: {

    "version_id" : {
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "version_num" : {
        type : "float"
    }, 

    "version_date" : {
        type : "date"
    }, 
    
    translations: {
        collection: 'LHRISVersionTrans',
        via: 'version_id'
    }


  }
};


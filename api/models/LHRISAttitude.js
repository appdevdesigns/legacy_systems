/**
 * LHRISAttitude.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_attitude_data',


  connection:'legacy_hris',



  attributes: {

    'id' : {
        columnName: "attitude_id",
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
    
    translations: {
        collection: 'LHRISAttitudeTrans',
        via: 'attitude_id'
    }


  }
};

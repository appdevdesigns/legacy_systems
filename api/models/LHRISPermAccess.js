/**
 * LHRISPermAccess.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_perm_access',


  connection:'legacy_hris',



  attributes: {

    "access_id" : {
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "ren_id" : {
        model: 'LHRISRen'
    }, 

    "viewer_guid" : {
        type : "string",
        size : 64,
        defaultsTo : "-"
    }, 


  }
};


/**
 * LHRISAltContact.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_altcontact',


  connection:'legacy_hris',



  attributes: {

    'id' : {
        columnName: "altcontact_id",
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "altcontact_guid" : {
        type : "string",
        size : 45
    }, 

    "ren_id" : {
        model: 'LHRISRen'
    }, 

    "altcontacttype_id" : {
        model: 'LHRISAltContactType'
    }, 

    "altcontact_contact" : {
        type : "string",
        size : 128,
        defaultsTo : "-"
    }, 


  }
};


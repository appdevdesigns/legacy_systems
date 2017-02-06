/**
 * LHRISXRefAttachmentRen.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_xref_attachmentren',


  connection:'legacy_hris',



  attributes: {

    'id' : {
        columnName: "ar_id",
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "ar_guid" : {
        type : "string",
        size : 45
    }, 

    "ren_id" : {
        model: 'LHRISRen'
    }, 

    "attachment_id" : {
        model: 'LHRISAttachment'
    }, 


  }
};


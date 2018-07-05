/**
 * LHRISAttachment.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_attachment_data',


  connection:'legacy_hris',



  attributes: {

    'id' : {
        columnName: "attachment_id",
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "attachment_guid" : {
        type : "string",
        size : 45
    }, 

    "attachment_timestamp" : {
        type : "datetime",
        //defaultsTo : "CURRENT_TIMESTAMP"
        defaultsTo: function() {
            return new Date();
        }
    }, 

    "attachment_filename" : {
        type : "string",
        size : 128
    }, 

    "attachment_access" : {
        type : "text"
    }, 

    "attachmenttype_id" : {
        model: 'LHRISAttachmentType'
    }, 

    "attachment_content" : {
        type: 'binary'
        //type : "?mediumblob?"
    }, 

    "attachment_mimetype" : {
        type: 'string',
        size: 255
        //type : "?tinytext?"
    }, 

    "attachment_isrestricted" : {
        type : "integer",
        size : 1,
        defaultsTo : "0"
    }, 

    "attachment_restrictionlevel" : {
        type : "integer",
        size : 11,
        defaultsTo : "0"
    }, 
    
    "image": {
        collection: "LHRISImage",
        via: "attachment_id"
    },
    
    "base_attachment_id": {
        collection: "LHRISImage",
        via: "base_attachment_id"
    },
    
    "xref_attachmentren": {
        collection: "LHRISXRefAttachmentRen",
        via: "attachment_id"
    },
    
    translations: {
        collection: 'LHRISAttachmentTrans',
        via: 'attachment_id'
    }


  }
};


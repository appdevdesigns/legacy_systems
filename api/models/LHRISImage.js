/**
 * LHRISImage.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_image',


  connection:'legacy_hris',



  attributes: {

    'id' : {
        columnName: "image_id",
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "image_size" : {
        type : "string",
        size : 45
    }, 

    "attachment_id" : {
        model: 'LHRISAttachment'
    }, 

    "base_attachment_id" : {
        model: 'LHRISAttachment',
        required: false
    }, 


  }
};


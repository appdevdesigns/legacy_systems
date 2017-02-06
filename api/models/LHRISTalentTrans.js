/**
 * LHRISTalentTrans.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_talent_trans',


  connection:'legacy_hris',



  attributes: {

    'id' : {
        columnName: "Trans_id",
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "talent_id" : {
        model: 'LHRISTalent'
    }, 

    "language_code" : {
        type : "string",
        size : 10,
        defaultsTo : "-"
    }, 

    "talent_comment" : {
        type : "text"
    }, 


  }
};


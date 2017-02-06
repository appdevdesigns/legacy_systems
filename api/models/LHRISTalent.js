/**
 * LHRISTalent.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_talent_data',


  connection:'legacy_hris',



  attributes: {

    'id' : {
        columnName: "talent_id",
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "talent_guid" : {
        type : "string",
        size : 45
    }, 

    "ren_id" : {
        model: 'LHRISRen'
    }, 

    "talenttype_id" : {
        model: 'LHRISTalentType'
    }, 
    
    translations: {
        collection: 'LHRISTalentTrans',
        via: 'talent_id'
    }


  }
};


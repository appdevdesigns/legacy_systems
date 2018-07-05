/**
 * LHRISTalentType.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_talenttype_data',


  connection:'legacy_hris',



  attributes: {

    'id' : {
        columnName: "talenttype_id",
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
    
    "talent_record": {
        collection: "LHRISTalent",
        via: "talenttype_id"
    },
    
    translations: {
        collection: 'LHRISTalentTypeTrans',
        via: 'talenttype_id'
    }


  }
};


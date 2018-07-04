/**
 * LHRISBloodType.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_bloodtype_data',


  connection:'legacy_hris',



  attributes: {

    'id' : {
        columnName: "bloodtype_id",
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

    medical_records: {
        collection: "LHRISMedical",
        via: "bloodtype_id"
    },
    
    translations: {
        collection: 'LHRISBloodTypeTrans',
        via: 'bloodtype_id'
    }


  }
};


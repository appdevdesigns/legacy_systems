/**
 * LHRISInsuranceType.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_insurancetype_data',


  connection:'legacy_hris',



  attributes: {

    'id' : {
        columnName: "insurancetype_id",
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
    
    insurance: {
        collection: "LHRISInsurance",
        via: "insurancetype_id"
    },
    
    translations: {
        collection: 'LHRISInsuranceTypeTrans',
        via: 'insurancetype_id'
    }


  }
};


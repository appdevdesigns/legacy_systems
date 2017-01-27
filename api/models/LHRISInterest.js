/**
 * LHRISInterest.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_interest_data',


  connection:'legacy_hris',



  attributes: {

    "interest_id" : {
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "interest_guid" : {
        type : "string",
        size : 45
    }, 

    "ren_id" : {
        model: 'LHRISRen'
    }, 

    "interesttype_id" : {
        model: 'LHRISInterestType'
    }, 
    
    translations: {
        collection: 'LHRISInterestTrans',
        via: 'interest_id'
    }


  }
};


/**
 * LHRISAddressType.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_addresstype_data',


  connection:'legacy_hris',



  attributes: {

    'id' : {
        columnName: "addresstype_id",
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

    "addressstype": {
        collection: "LHRISAddress",
        via: "addresstype_id"
    }, 
    
    translations: {
        collection: 'LHRISAddressTypeTrans',
        via: 'addresstype_id'
    }


  }
};


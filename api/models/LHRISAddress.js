/**
 * LHRISAddress.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_address',


  connection:'legacy_hris',



  attributes: {

    'id' : {
        columnName: "address_id",
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "address_guid" : {
        type : "string",
        size : 45
    }, 

    "family_id" : {
        model: 'LHRISFamily'
    }, 

    "addresstype_id" : {
        model: 'LHRISAddressType'
    }, 

    "country_id" : {
        model: 'LHRISCountry'
    }, 

    "phone_id" : {
        model: 'LHRISPhone'
    }, 

    "location_id" : {
        model: 'LHRISAssignLocation'
    }, 

    "address_postalcode" : {
        type : "string",
        size : 45,
        defaultsTo : "-"
    }, 

    "address_province" : {
        type : "string",
        size : 100,
        defaultsTo : "-"
    }, 

    "address_city" : {
        type : "string",
        size : 100,
        defaultsTo : "-"
    }, 

    "address_street" : {
        type : "string",
        size : 200,
        defaultsTo : "-"
    }, 


  }
};


/**
 * LHRISDependent.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_dependent',


  connection:'legacy_hris',



  attributes: {

    'id' : {
        columnName: "dependent_id",
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "dependent_guid" : {
        type : "string",
        size : 45
    }, 

    "ren_id" : {
        model: 'LHRISRen'
    }, 

    "schoolingmethod_id" : {
        model: 'LHRISSchoolingMethod'
    }, 


  }
};


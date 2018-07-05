/**
 * LHRISDegree.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_degree_data',


  connection:'legacy_hris',



  attributes: {

    'id' : {
        columnName: "degree_id",
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

    "degree_weight" : {
        type : "integer",
        size : 11,
        defaultsTo : "0"
    }, 
    
    "education": {
        collection: "LHRISEducation",
        via: "degree_id"
    },
    
    translations: {
        collection: 'LHRISDegreeTrans',
        via: 'degree_id'
    }


  }
};


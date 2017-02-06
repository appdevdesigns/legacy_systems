/**
 * LHRISPermRuleset.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_perm_ruleset',


  connection:'legacy_hris',



  attributes: {

    'id' : {
        columnName: "ruleset_id",
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "ruleset_label" : {
        type : "string",
        size : 45,
        defaultsTo : "-"
    }, 

    "ruleset_matches" : {
        type : "string",
        size : 3,
        defaultsTo : "any"
    }, 

    "filter_id" : {
        type : "integer",
        size : 11,
        defaultsTo : "0"
    }, 
    
    rules: {
        collection: 'LHRISPermRule',
        via: 'ruleset_id'
    }


  }
};


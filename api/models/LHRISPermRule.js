/**
 * LHRISPermRule.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_perm_rule',


  connection:'legacy_hris',



  attributes: {

    "rule_id" : {
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "ruleset_id" : {
        model: 'LHRISPermRuleset'
    }, 

    "searchablefields_id" : {
        type : "integer",
        size : 11
    }, 

    "rule_field" : {
        type : "string",
        size : 45,
        defaultsTo : "-"
    }, 

    "rule_condition" : {
        type : "string",
        size : 45,
        defaultsTo : "-"
    }, 

    "rule_value" : {
        type : "text"
    }, 


  }
};


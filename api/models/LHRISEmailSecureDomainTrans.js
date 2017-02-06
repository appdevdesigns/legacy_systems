/**
 * LHRISEmailSecureDomainTrans.js
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoCreatedAt:false,
  autoUpdatedAt:false,
  autoPK:false,
  migrate:'safe',  // don't update the tables!



  tableName:'hris_email_secure_domain_trans',


  connection:'legacy_hris',



  attributes: {

    'id' : {
        columnName: "Trans_id",
        type : "integer",
        size : 11,
        primaryKey : true,
        autoIncrement : true
    }, 

    "domain_id" : {
        model: 'LHRISEmailSecureDomain'
    }, 

    "language_code" : {
        type : "string",
        size : 10,
        defaultsTo : "-"
    }, 

    "domain_label" : {
        type : "string",
        size : 64
    }, 


  }
};


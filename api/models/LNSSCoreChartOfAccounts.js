/**
* LNSSCoreGLTrans.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var AD = require('ad-utils');

module.exports = {

    tableName: "nss_core_chartofaccounts",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    migrate:'safe',  // don't update the tables!


    connection:"legacy_stewardwise",


    attributes: {

        chartofaccounts_id : {
            type : "integer",
            size : 11,
            primaryKey : true,
            autoIncrement : true
        }, 

        chartofaccounts_accountNum : {
            type : "integer",
            size : 11,
            defaultsTo : "0"
        }, 

        chartofaccounts_description : {
            type : "text"
        }, 

        chartofaccounts_iandecategory : {
            type : "text"
        }, 

        chartofaccounts_transactiontype : {
            type : "string",
            size : "10"
        }

    },
    
    
    ////////////////////////////
    // Model class methods
    ////////////////////////////
    

    
};



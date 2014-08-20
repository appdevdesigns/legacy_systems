/**
* LNSSRen.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    tableName:"nss_core_ren",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    // migrate:'safe',  // don't update the tables!



    connection:"legacy_stewardwise",
// connection:"nss",



    attributes: {

        nssren_id : {
            type : "integer",
            size : 11,
            primaryKey : true,
            autoIncrement : true
        }, 

        ren_id : {
            type : "integer",
            size : 11,
            defaultsTo : "0"
        }, 

        nssren_salaryAmount : {
            type : "float",
            defaultsTo : "0"
        }, 

        nssren_salaryCap : {
            type : "float",
            defaultsTo : "0"
        }, 

        nssren_additionalCap : {
            type : "float",
            defaultsTo : "0"
        }, 

        nssren_nscID : {
            type : "integer",
            size : 11,
            defaultsTo : "0"
        }, 

        nssren_per1 : {
            type : "float",
            defaultsTo : "0"
        }, 

        nssren_per2 : {
            type : "float",
            defaultsTo : "0"
        }, 

        nssren_per3 : {
            type : "float",
            defaultsTo : "0"
        }, 

        nssren_per4 : {
            type : "float",
            defaultsTo : "0"
        }, 

        nssren_per5 : {
            type : "float",
            defaultsTo : "0"
        }, 

        nssren_per6 : {
            type : "float",
            defaultsTo : "0"
        }, 

        nssren_per7 : {
            type : "float",
            defaultsTo : "0"
        }, 

        nssren_per8 : {
            type : "float",
            defaultsTo : "0"
        }, 

        nssren_per9 : {
            type : "float",
            defaultsTo : "0"
        }, 

        nssren_per10 : {
            type : "float",
            defaultsTo : "0"
        }, 

        nssren_per11 : {
            type : "float",
            defaultsTo : "0"
        }, 

        nssren_per12 : {
            type : "float",
            defaultsTo : "0"
        }, 

        nssren_isActive : {
            type : "integer",
            size : 2,
            defaultsTo : "1"
        }, 

        nssren_ytdBaseSalary : {
            type : "float",
            defaultsTo : "0"
        }, 

        nssren_ytdCode7000Additional : {
            type : "float",
            defaultsTo : "0"
        }, 

        nssren_ytdCode7000Deductions : {
            type : "float",
            defaultsTo : "0"
        }, 

        nssren_ytdBalance : {
            type : "float",
            defaultsTo : "0"
        }, 

        nssren_balancePeriod : {
            type : "string",
            size : 7
        }, 

        territory_id : {
            type : "integer",
            size : 11,
            defaultsTo : "0"
        }, 

        nssren_monthsdonations : {
            type : "float",
            defaultsTo : "0"
        }, 

        nssren_emailNotifications : {
            type : "integer",
            size : 2,
            defaultsTo : "1"
        }, 

        nssren_lastBalanceUpdate : {
            type : "date",
            defaultsTo : "0000-00-00",
            required:false
        }, 

        nssren_advancesAllowed : {
            type : "integer",
            size : 11,
            defaultsTo : "1"
        }, 

        nssren_13MonthReportDate : {
            type : "date",
            defaultsTo : "0000-00-00",
            required:false
        }, 

        nssren_mergeDate : {
            type : "date",
            defaultsTo : "0000-00-00",
            required:false
        }, 

        ren_guid : {
            type : "text"
        }, 


    }
};


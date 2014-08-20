/**
* LHRISAssignment.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    tableName:"hris_assignment",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    // migrate:'safe',  // don't update the tables!



  connection:"legacy_hris",
// connection:"hris",



    attributes: {

        assignment_id : {
            type : "integer",
            size : 11,
            primaryKey : true,
            autoIncrement : true
        }, 

        assignment_guid : {
            type : "string",
            size : 45
        }, 

        ren_id : {
            model:'LHRISRen'
        }, 

        team_id : {
            type : "integer",
            size : 11,
            defaultsTo : "1"
        }, 

        position_id : {
            type : "integer",
            size : 11,
            defaultsTo : "1"
        }, 

        assignment_startdate : {
            type : "date",
            defaultsTo : "1000-01-01",
            required:false
        }, 

        assignment_enddate : {
            type : "date",
            defaultsTo : "1000-01-01",
            required:false
        }, 

        assignment_isprimary : {
            type : "integer",
            size : 1,
            defaultsTo : "0"
        }, 


    }
};


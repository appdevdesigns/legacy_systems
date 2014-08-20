/**
* LHRISXRefTeamLocation.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    // tableName:"lhris_xref_team_location",
    tableName:"hris_xref_team_location",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    // migrate:'safe',  // don't update the tables!


    connection:"legacy_hris",
// connection:"hris",



    attributes: {

        tl_id : {
            type : "integer",
            size : 11,
            primaryKey : true,
            autoIncrement : true
        }, 

        tl_guid : {
            type : "string",
            size : 45
        }, 

        team_id : {
            type : "integer",
            size : 11
        }, 

        location_id : {
            model:'LHRISAssignLocation'
        }, 


    }
};


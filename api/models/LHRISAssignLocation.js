/**
* LHRISAssignLocation.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    // tableName:"lhris_assign_location_data",
    tableName:"hris_assign_location_data",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    // migrate:'safe',  // don't update the tables!



    connection:"legacy_hris",
// connection:"hris",



    attributes: {

        location_id : {
            type : "integer",
            size : 11,
            primaryKey : true,
            autoIncrement : true
        }, 

        location_guid : {
            type : "string",
            size : 45
        }, 

        locationtype_id : {
            type : "integer",
            size : 11
        }, 

        parent_id : {
            model:'LHRISAssignLocation'
        }, 

        translations:{
            collection:'LHRISAssignLocationTrans',
            via:'location_id'
        },

        locations:{
            collection:'LHRISAssignLocation',
            via:'parent_id'
        },


        team_id: {
            collection:'LHRISXRefTeamLocation',
            via:'location_id'
        }


    }
};


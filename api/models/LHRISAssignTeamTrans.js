/**
* LHRISAssignTeamTrans.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    tableName:"hris_assign_team_trans",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    migrate:'safe',  // don't update the tables!


    connection:"legacy_hris",

    attributes: {
        
        Trans_id: {
            type : "integer",
            size : 11,
            primaryKey : true,
            autoIncrement : true
        },
        
        team_id: {
            model: "LHRISAssignTeam"
        },
        
        language_code: {
            type: "string",
            size: 10
        },
        
        team_label: {
            type: "string",
            size: 64
        }

    }
};


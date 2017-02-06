/**
* LHRISAssignTeam.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    tableName:"hris_assign_team_data",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    migrate:'safe',  // don't update the tables!


    connection:"legacy_hris",

    attributes: {

        'id' : {
            columnName: 'team_id',
            type : "integer",
            size : 11,
            primaryKey : true,
            autoIncrement : true
        },
        
        is_protected: {
            type: "integer",
            size: 1,
            defaultsTo: 0
        },
        
        rptlvl_id: {
            model: "LHRISAssignRptlvl"
        },
        
        mcc_id: {
            model: "LHRISAssignMCC"
        },
        
        gma_locationID: {
            type: "integer",
            size: 11
        },
        
        team_type: {
            type: "string",
            size: 10,
            defaultsTo: "PHYSICAL"
        },
        
        is_active: {
            type: "integer",
            size: 1,
            defaultsTo: 1
        },
        
        translations: {
            collection: 'LHRISAssignTeamTrans',
            via: 'team_id'
        },
        
        locationXref: {
            collection: 'LHRISXrefTeamLocation',
            via: 'team_id'
        }

    }
};


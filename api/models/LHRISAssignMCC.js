/**
* LHRISAssignmentMCC.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    tableName:"hris_assign_mcc_data",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    migrate:'safe',  // don't update the tables!



  connection:"legacy_hris",



    attributes: {

        id: {
            columnName: 'mcc_id',
            type: "integer",
            size: 11,
            primaryKey: true,
            autoIncrement: true
        }, 

        mcc_guid: {
            type: "string",
            size: 45
        }, 

        parent_id: {
            model: 'LHRISAssignMCC'
        },
        
        children: {
            collection: 'LHRISAssignMCC',
            via: 'parent_id'
        },

        mcc_weight: {
            type: "integer",
            size: 11,
            defaultsTo : 0
        },
        
        assign_team: {
            collection: "LHRISAssignTeam",
            via: "mcc_id"
        },

        is_protected: {
            type: "integer",
            size: 1,
            defaultsTo: 0
        },
        
        translations: {
            collection: "LHRISAssignMCCTrans",
            via: "mcc_id"
        }

    }
};


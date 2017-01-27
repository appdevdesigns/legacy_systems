/**
* LHRISAssignRptLvlTrans.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    tableName: "hris_assign_mcc_trans",
    autoCreatedAt: false,
    autoUpdatedAt: false,
    autoPK: false,
    migrate: 'safe',  // don't update the tables!


    connection: "legacy_hris",

    attributes: {
        
        Trans_id: {
            type : "integer",
            size : 11,
            primaryKey : true,
            autoIncrement : true
        },
        
        mcc_id: {
            model: "LHRISAssignMCC"
        },
        
        language_code: {
            type: "string",
            size: 10
        },
        
        mcc_label: {
            type: "string",
            size: 64
        },
        
        mcc_description: {
            type: "text"
        },
        
        ancestry_label: {
            type: "string",
            size: 255
        }

    }
};


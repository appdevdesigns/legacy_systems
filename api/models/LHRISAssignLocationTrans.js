/**
* LHRISAssignLocationTrans.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    // tableName:"lhris_assign_location_trans",
    tableName:"hris_assign_location_trans",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    migrate:'safe',  // don't update the tables!



    connection:"legacy_hris",
// connection:"hris",



    attributes: {

        Trans_id : {
            type : "integer",
            size : 11,
            primaryKey : true,
            autoIncrement : true
        }, 

        location_id : { 
            model: 'LHRISAssignLocation'
        }, 

        language_code : {
            type : "string",
            size : 10,
            defaultsTo : "-"
        }, 

        location_label : {
            type : "string",
            size : 45
        }


    }
};


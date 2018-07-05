/**
* LHRISAssignLocationType.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    tableName:"hris_assign_locationtype_data",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    migrate:'safe',  // don't update the tables!


    connection:"legacy_hris",



    attributes: {

        id : {
            columnName: 'locationtype_id',
            type : "integer",
            size : 11,
            primaryKey : true,
            autoIncrement : true
        }, 

        is_protected : {
            type : "integer",
            size : 1,
            defaultsTo : "0"
        },
        
        "assign_location": {
            collection: "LHRISAssignLocation",
            via: "locationtype_id"
        }, 

        translations:{
            collection: 'LHRISAssignLocationTypeTrans',
            via: 'locationtype_id'
        }


    }
};


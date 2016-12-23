/**
* HRISRen
*
* @module      :: Model
* @description :: A short summary of how this model works and what it represents.
*
*/

module.exports = {

    // tableName:"lhris_ren_data",
    tableName:"hris_ren_data",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    migrate:'safe',


    connection: ['legacy_hris'],



    attributes: {

        /* e.g.
        nickname: 'string'
        */

        ren_id  : { 
            type:'INTEGER',
            primaryKey:true,
            autoIncrement: true
        },


        ren_guid    : 'STRING',


        rentype_id  : 'INTEGER',


        family_id   : {
            model:'LHRISFamily'
        },


        ren_surname : 'STRING',


        ren_givenname   : 'STRING',


        ren_namecharacters  : 'STRING',


        ren_namepinyin  : 'STRING',


        ren_preferredname   : 'STRING',


        ren_birthdate   : {
            type : "date",
            defaultsTo : "0000-00-00",
            required:false
        },


        ren_deathdate   : {
            type : "date",
            defaultsTo : "0000-00-00",
            required:false
        },


        gender_id   : 'INTEGER',


        maritalstatus_id    : 'INTEGER',


        ethnicity_id    : 'INTEGER',


        ren_primarycitizenship  : 'INTEGER',


        statustype_id   : 'INTEGER',


        ren_isfamilypoc : 'INTEGER',


        ren_preferredlang   : 'INTEGER',


        ren_picture : '?BLOB?',

        emails: {
            collection:'LHRISEmail',
            via:'ren_id'
        },

        phones:{
            collection: 'LHRISPhone',
            via: 'ren_id'
        },

        assignments: {
            collection: 'LHRISAssignment',
            via: 'ren_id'
        }

    }

};

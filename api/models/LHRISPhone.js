/**
* HRISPhone
*
* @module      :: Model
* @description :: A short summary of how this model works and what it represents.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    // tableName:"lhris_phone_data",
    tableName:"hris_phone_data",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
   migrate:'safe',


    connection: ['legacy_hris'],
// connection: ['hris'],


    attributes: {

        /* e.g.
        nickname: 'string'
        */

        phone_id    : { 
            type:'INTEGER',
            primaryKey:true,
            autoIncrement:true
        },


        phone_guid  : 'STRING',

//        ren_id : 'INTEGER',

        ren_id  : { 
            model:'LHRISRen'
        },


        phonetype_id    : 'INTEGER',


        phone_countrycode   : 'INTEGER',


        phone_number    : 'STRING'
    }

};

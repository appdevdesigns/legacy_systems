/**
* HRISPhone
*
* @module      :: Model
* @description :: A short summary of how this model works and what it represents.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    tableName:"hris_phone_data",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    migrate:'safe',


    connection: ['legacy_hris'],

    attributes: {

        phone_id: { 
            type: 'INTEGER',
            primaryKey: true,
            autoIncrement: true
        },

        phone_guid: {
            type: 'string',
            size: 45
        },

        ren_id: { 
            model: 'LHRISRen'
        },

        phonetype_id: {
            model: 'LHRISPhoneType'
        },

        phone_countrycode: {
            model: 'LHRISCountry'
        },

        phone_number: {
            type: 'string',
            size: 45
        },
        
        translations: {
            collection: 'LHRISPhoneTrans',
            via: 'phone_id'
        }
    }

};

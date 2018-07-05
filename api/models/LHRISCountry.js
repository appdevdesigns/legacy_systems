/**
* LHRISCountry.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    // tableName:"lhris_country_data",
    tableName:"hris_country_data",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    migrate:'safe',  // don't update the tables!


    connection:"legacy_hris",
// connection:"hris",


    attributes: {

        'id' : {
            columnName: 'country_id',
            type : 'integer',
            size : 11,
            primaryKey : true,
            autoIncrement : true
        }, 

        'country_code' : {
            type : 'string',
            size : 2
        }, 

        'country_callingcode' : {
            type : 'string',
            size : 10,
            defaultsTo : '-'
        }, 

        'country_weight' : {
            type : 'integer',
            size : 11,
            defaultsTo : '0'
        },

        'passport_record': {
             collection: "LHRISPassport",
             via: "country_id"
        },

        'phone_record': {
             collection: "LHRISPhone",
             via: "phone_countrycode"
        },

        "address_record": {
           collection: "LHRISAddress",
            via: "country_id"
        },
        
        "accounts": {
            collection: 'LHRISAccount',
            via: 'country_id'
        },
        
        "primarycitizenship": {
            collection: "LHRISRen",
            via: "ren_primarycitizenship"
        },
        
        "sending_region": {
            collection: "LHRISSendingRegion",
            via: "country_id"
        },
        
        "visa_type": {
            collection: "LHRISVisaType",
            via: "country_id"
        },

        'translations': {
            collection:'LHRISCountryTrans',
            via:'country_id'
        }


    }
};


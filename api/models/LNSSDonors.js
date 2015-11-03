/**
* LNSSDonors.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();

module.exports = {

    tableName:"nss_don_donors",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    // migrate:'safe',  // don't update the tables!



    connection:"legacy_stewardwise",



    attributes: {

        donor_id : {
            type : "integer",
            size : 11,
            primaryKey : true,
            autoIncrement : true
        }, 
        
        donors_lastName: {
            type: "string",
            size: 50
        },
        
        donors_firstName: {
            type: "string",
            size: 50
        },
        
        donors_chineseName: {
            type: "string",
            size: 50
        },
        
        donors_spouseLastName: {
            type: "string",
            size: 50
        },
        
        donors_spouseFirstName: {
            type: "string",
            size: 50
        },
        
        donors_postalCode: {
            type: "string",
            size: 50
        },
        
        donors_province: {
            type: "string",
            size: 50
        },
        
        donors_address: {
            type: "string",
            size: 50
        },
        
        donors_country: {
            type: "string",
            size: 50
        },
        
        donors_city: {
            type: "string",
            size: 50
        },
        
        donors_homePhone: {
            type: "string",
            size: 50
        },
        
        donors_cellPhone: {
            type: "string",
            size: 50
        },
        
        donors_email: {
            type: "string",
            size: 50
        },
        
        donors_type: {
            type: "integer",
            size: 2
        },
        
        donors_nationality: {
            type: "string",
            size: 50
        },
        
        donorRelations: {
            collection: 'LNSSDonorRelations',
            via: 'donor_id'
        },
        
        toJSON: function() {
            var obj = this.toObject();
            
            // Decode Chinese HTML entities
            obj.donors_chineseName = entities.decode(this.donors_chineseName);
            
            // Donor type
            var types = {
                0: 'Normal',
                99: 'Anonymous local',
                98: 'Anonymous other'
            };
            obj.donors_type = types[obj.donors_type] || obj.donors_type;
            
            return obj;
        }

    }
    
    
};


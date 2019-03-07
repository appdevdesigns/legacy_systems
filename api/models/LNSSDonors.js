/**
* LNSSDonors.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var moment = require('moment');
var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();

module.exports = {

    tableName:"nss_don_donors",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    migrate:'safe',  // don't update the tables!



    connection:"legacy_stewardwise",



    attributes: {

        'id' : {
            columnName: 'donor_id',
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
            
            // Decode HTML entities
            for (var key in obj) {
                if (obj[key].length) {
                    obj[key] = entities.decode(obj[key]);
                }
            }
            
            // Donor type
            obj.donors_type = LNSSDonors.DonorTypes[obj.donors_type] || obj.donors_type;
            
            return obj;
        }

    },
    
    
    DonorTypes: {
        0: 'Normal',
        99: 'Anonymous local',
        98: 'Anonymous other'
    },
    
    
    /**
     * @param {string|Date} [startDate]
     * @param {string|Date} [enbDate]
     * @return {Promise}
     */
    getDonorTotals(startDate=null, endDate=null) {
        return new Promise((resolve, reject) => {
            // Optional date conditions
            var params = [];
            var dateCondition = '';
            if (startDate) {
                params.push(moment(startDate).format('YYYY-MM-DD'));
                dateCondition += ` AND batch.donBatch_dateProcessed >= ? `;
            }
            if (endDate) {
                params.push(moment(endDate).format('YYYY-MM-DD'));
                dateCondition += ` AND batch.donBatch_dateProcessed <= ? `;
            }
            
            LNSSDonors.query(`
                SELECT
                    donor.*,
                    SUM(item.donItem_amount) AS totalAmount,
                    COUNT(item.donItem_id) AS numGifts,
                    COUNT(DISTINCT batch.nssren_id) AS numStaff,
                    COUNT(DISTINCT batch.nsc_territory_id) AS numLocations
                
                FROM
                    nss_don_donors AS donor
                    JOIN nss_don_donItem AS item
                        ON donor.donor_id = item.donor_id
                    JOIN nss_don_donBatch AS batch
                        ON item.donBatch_id = batch.donBatch_id
                
                WHERE
                    -- Only count donations that were received
                    batch.donBatch_status = "Received"
                    -- Exclude anonymous donors
                    AND donor.donors_type < 98
                    
                    ${dateCondition}
                    
                GROUP BY
                    donor.donor_id
            
            `, params, (err, list) => {
                if (err) reject(err);
                else {
                    resolve(list);
                }
            });
        });
    },
    
    
};


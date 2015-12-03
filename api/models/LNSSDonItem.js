/**
* LNSSDonItem.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var AD = require('ad-utils');

module.exports = {

    tableName:"nss_don_donItem",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    // migrate:'safe',  // don't update the tables!



    connection:"legacy_stewardwise",



    attributes: {

        donItem_id : {
            type : "integer",
            size : 11,
            primaryKey : true,
            autoIncrement : true
        }, 
        
        /*
        donBatch_id : {
            type : "integer",
            size : 11,
        }, 
        */
        donBatch_id: {
            model: 'LNSSDonBatch'
        },
        
        donItem_dateReceived: {
            type: 'date',
            defaultsTo: '0000-00-00'
        },
        
        donItem_amount: {
            type: 'float',
            defaultsTo: 0
        },
        
        donItem_type: {
            type: 'integer',
            size: 3
        },
        
        donor_id: {
            model: 'LNSSDonors'
        },
        
        donItem_description: {
            type: 'string',
            size: 80
        }

    },
    
    
    ////////////////////////////
    // Model class methods
    ////////////////////////////
    
    /**
     * Finds donation items to a given staff, from a given donor.
     *
     * @param integer nssRenID
     * @param integer donorID
     * @param integer limit
     *      Optional. Default is no limit.
     * @return Deferred
     */
    byDonor: function(nssRenID, donorID, limit) {
        var dfd = AD.sal.Deferred();
        
        var limitClause = '';
        if (limit > 0) {
            limitClause = "LIMIT ?";
        }
        
        LNSSDonItem.query(" \
            SELECT \
                item.donItem_id, \
                item.donor_id, \
                CONCAT( \
                    donor.donors_lastName, \
                    ', ', \
                    donor.donors_firstName \
                ) AS 'donor_name', \
                item.donItem_dateReceived, \
                item.donItem_amount, \
                donTypes.type AS 'donItem_type' \
            FROM \
                nss_don_donBatch AS batch \
                JOIN nss_don_donItem AS item \
                    ON batch.donBatch_id = item.donBatch_id \
                JOIN nss_don_donors AS donor \
                    ON donor.donor_id = item.donor_id \
                LEFT JOIN ( \
                    SELECT 0 AS 'id', 'Unknown' AS 'type' \
                    UNION SELECT 1, 'Monthly' \
                    UNION SELECT 2, 'One time' \
                ) AS donTypes \
                    ON item.donItem_type = donTypes.id \
            WHERE \
                batch.nssren_id = ? \
                AND item.donor_id = ? \
            ORDER BY \
                item.donItem_dateReceived DESC \
            \
            " + limitClause + " \
        ", [nssRenID, donorID, limit], function(err, results) {
            
            if (err) {
                dfd.reject(err);
            } else {
                dfd.resolve(results);
            }
            
        });
        
        return dfd;
    }
};


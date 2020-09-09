/**
* LHRISAccount.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    tableName:"hris_account",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    migrate:'safe',  // don't update the tables!


    connection:"legacy_hris",


    attributes: {

        id : {
            columnName: 'account_id',
            type : "integer",
            size : 11,
            primaryKey : true,
            autoIncrement : true
        }, 

        account_guid : {
            type : "string",
            size : 45
        }, 

        family_id : {
            model: 'LHRISFamily'
        }, 

        account_number : {
            type : "string",
            size : 45
        }, 

        country_id : {
            model: 'LHRISCountry'
        }, 
        
        "worker": {
            collection: "LHRISWorker",
            via: "account_id"
        },

        account_isprimary : {
            type : "integer",
            size : 1,
            defaultsTo : "1"
        }


    },
    
    
    ////////////////////////////
    // Model class methods
    ////////////////////////////
    
    /**
     * Finds the other account numbers from the same family and country.
     * Versions of the account numbers with non-alphanumeric characters stripped
     * out will also be included in the results.
     *
     * @param {string} accountNum
     * @return {Promise} 
     */
    relatedAccounts: function(accountNum) {
        return new Promise((resolve, reject) => {
            LHRISAccount.query(`
                SELECT
                    a2.account_number
                FROM
                    hris_account AS a1
                    JOIN hris_account AS a2
                        ON a1.family_id = a2.family_id
                        AND a1.country_id = a2.country_id
                WHERE
                    a1.account_number = ?
            `, [accountNum], (err, list) => {
                if (err) reject(err);
                else {
                    let results = [];
                    list.forEach((row) => {
                        results.push(row.account_number);
                        // Also add a version stripped of all non-alphanumerics
                        let stripped = row.account_number.replace(/\W/g, '');
                        if (results.indexOf(stripped) < 0) {
                            results.push(stripped);
                        }
                    });
                    
                    resolve(results);
                }
            });
        });
    }
    
};


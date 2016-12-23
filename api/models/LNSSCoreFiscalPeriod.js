/**
* LNSSCoreFiscalPeriod.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var AD = require('ad-utils');

module.exports = {

    tableName:"nss_core_fiscalperiod",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    migrate:'safe',  // don't update the tables!



    connection:"legacy_stewardwise",



    attributes: {

        requestcutoff_id : {
            type : "integer",
            size : 11,
            primaryKey : true,
            autoIncrement : true
        }, 

        requestcutoff_year : {
            type : "integer",
            size : 6,
            defaultsTo : "0"
        }, 

        requestcutoff_period : {
            type : "integer",
            size : 6,
            defaultsTo : "0"
        }, 

        requestcutoff_date : {
            type : "date",
            defaultsTo : "0000-00-00"
        }, 

        requestcutoff_isClosed : {
            type : "integer",
            size : 2,
            defaultsTo : "0"
        }, 

    },
    
    
    ////////////////////////////
    // Model class methods
    ////////////////////////////
    
    
    /**
     * Find the current fiscal period.
     * @return Deferred
     */
    currentPeriod: function() {
        var dfd = AD.sal.Deferred();
        
        var currentPeriod = {
            requestcutoff_id: 0,    // primary key
            month: 'mm',            // fiscal month
            year: 'yyyy',           // fiscal year
            fiscalPeriod: 'yyyymm', // full fiscal period string
            date: 'yyyy-mm-dd'      // real date (roughly)
        };
        
        /*
            Fiscal period entries are to be sorted by GLPrefix (YYYY) 
            and period number (MM). Sorting by requestcutoff_id or by the
            period's date is similar in practice but not guaranteed to always
            be accurate.
            
            requestcutoff_id is autoincremented and some entries could 
            conceivably get created out of order under edge conditions.
            
            requestcutoff_date is not authoritative and can be arbitrarily
            changed.
        */
        
        // Find the earliest open period
        LNSSCoreFiscalPeriod.query(" \
            SELECT \
                fp.requestcutoff_id, \
                fy.fiscalyear_glprefix AS 'year', \
                LPAD(fp.requestcutoff_period, 2, '0') AS 'month', \
                CONCAT( \
                    fy.fiscalyear_glprefix, \
                    LPAD(fp.requestcutoff_period , 2, '0') \
                ) AS 'fiscalPeriod', \
                fp.requestcutoff_date AS 'date' \
            FROM \
                nss_core_fiscalperiod AS fp \
                JOIN nss_core_fiscalyear AS fy \
                    ON fp.requestcutoff_year = fy.fiscalyear_id \
            WHERE \
                fp.requestcutoff_isClosed = 0 \
            ORDER BY \
                fy.fiscalyear_glprefix ASC, \
                fp.requestcutoff_period ASC \
            LIMIT 1 \
        ", function(err, results) {
            if (err) {
                dfd.reject(err);
            } else {
                currentPeriod = results[0];
                dfd.resolve(currentPeriod);
            }
        });
        
        return dfd;
    }
    
};


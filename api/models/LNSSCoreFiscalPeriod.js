/**
* LNSSCoreFiscalPeriod.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var AD = require('ad-utils');
var moment = require('moment');

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
    },
    
    
    /**
     * Generate a lookup list of fiscal periods to the calendar months of their
     * cutoff dates.
     *
     * Not currently used by anything.
     *
     * Usually, the cutoff dates do work out in a logical way. But it's possible
     * that they don't, depending on real world circumstances around the period
     * closing time. So the better way is to just subtract 6 months from the
     * fiscal period to get the calendar date.
     *
     * @param {object} [options]
     * @param {string|date} [options.min]
     *      Minumum calendar date.
     *      Default is 2001-01-01.
     * @param {string|date} [options.max]
     *      Maximum calendar date.
     *      Default is 9999-01-01.
     * @param {string} [options.format]
     *      The moment.js format to apply to the calendar dates.
     *      Default is YYYY-MM.
     * @return {Promise}
     */
    fiscalPeriodsToCalendar: function(options={}) {
        return new Promise((resolve, reject) => {
            options.min = options.min || '2001-01-01'; // min calendar date
            options.max = options.max || '9999-01-01'; // max calendar date
            options.format = options.format || 'YYYY-MM'; // moment.js format
            
            LNSSCoreFiscalPeriod.query(
                `
                    SELECT
                        LPAD(p.requestcutoff_period, 2, '0') AS fiscalPeriod,
                        y.fiscalyear_glprefix AS fiscalYear,
                        EXTRACT(YEAR FROM p.requestcutoff_date) AS calendarYear,
                        EXTRACT(MONTH FROM p.requestcutoff_date) AS calendarMonth
                    FROM
                        nss_core_fiscalyear AS y
                        JOIN nss_core_fiscalperiod AS p
                            ON y.fiscalyear_id = p.requestcutoff_year
                    WHERE
                        p.requestcutoff_date >= ?
                        AND p.requestcutoff_date <= ?
                    ORDER BY
                        p.requestcutoff_year ASC, 
                        p.requestcutoff_period ASC
                `,
                [options.min, options.max],
                (err, list) => {
                    if (err) reject(err);
                    else {
                        var results = {};
                        list.forEach((row) => {
                            var fiscalPeriod = `${row.fiscalYear}${row.fiscalPeriod}`;
                            var calendarPeriod = moment(row.calendarYear + '-' + row.calendarMonth + '-01');
                            results[fiscalPeriod] = calendarPeriod.format(options.format);
                        });
                        
                        resolve(results);
                    }
                }
            );
        });
    }
    
};


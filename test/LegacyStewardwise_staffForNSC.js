
var path = require('path');
var fs = require('fs');
var AD = require('ad-utils');
var async = require('async');


var service = null;
var sails = null;


var assert = require('chai').assert;
describe('test LegacyStewardwise.staffForNSCxxx()',function(){


    before(function(done){

        // loading Sails can take a few seconds:
        this.timeout(40000);

        async.series([

            // load Sails:  AD.test.sails.load( fn(err, sails) );
            function(next) {

                AD.test.sails.load()
                .fail(function(err){
                    AD.log.error('... error loading sails : ', err);
                    next(err);
                })
                .done(function(obj) {
                    sails = obj;
                    next();
                });

            },



            // prepare data : AD.test.db.init( sails, [ { 'modelName':file/path/data.js'}, ...])
            function(next) {


                var definitions = [
                    {model:LNSSCoreNSC, key:'nsc_id',               path:path.join(process.cwd(), 'setup', 'test_data', 'data_nss_nsc.js' )},
                    {model:LNSSCoreNSCTerritory, key:'coverage_id', path:path.join(process.cwd(), 'setup', 'test_data', 'data_nss_nsc_territory.js' )},
                    {model:LNSSRen, key:'nssren_id',                path:path.join(process.cwd(), 'setup', 'test_data', 'data_nss_ren.js' )}
                    
                    // {model:LNSSCoreNSC, path:path.join(process.cwd(), 'setup', 'test_data', 'data_nss_nsc.js' )}
                ];

                AD.test.data.load(definitions)
                .fail(function(err){
                    next(err);
                })
                .done(function(){
                    next();
                });
                  
            },



            // service = AD.test.service(sails, 'LegacyStewardwise');
            function(next) {
                service = LegacyStewardwise.staffForNSCByGUID;

                next();
            }


        ], function(err, results){

            if (err){
                done(err);
            } else {
// AD.log('... ... done();')
                done();
            }
        });
        

    });

    after(function(done){

        AD.test.data.restore([LNSSCoreNSC])
        .fail(function(err){
            done(err);
        })
        .done(function(){
            done();
        });
        
    });



    it('calling .staffForNSCByGUID should return HRIS info with LegacyStewardwise data ... ',function(done){

        LegacyStewardwise.staffForNSCByGUID()
        .fail(function(err){
            assert.ok(false, ' -> should not have an error!')
            done();
        })
        .done(function(list){
            assert.isDefined(list, ' --> should have gotten some results ');
            assert.isArray(list, ' --> returned an array of values.');
            assert.operator(list.length, '>', 0, ' --> returned some values');

            var hrisFields = {
                ren_surname:1
            }
            var hasHRISFields = true;
            var hasLegacyStewardwise = true;
            list.forEach(function(entry){
                for (var h in hrisFields) {

                    if (typeof entry[h] == 'undefined') {
                        hasHRISFields = false;
                    }

                }

                if ( typeof entry['LegacyStewardwise'] == 'undefined') {
                    hasLegacyStewardwise = false;
                }
                
            });
            
            
            assert.isTrue(hasHRISFields, ' --> has our expected HRIS fields.');
            assert.isTrue(hasLegacyStewardwise, ' --> has our expected LegacyStewardwise fields.');
            done();
        })

    });



    it('calling .staffForNSCByGUID with no guids returns all active staff ... ',function(done){

        LegacyStewardwise.staffForNSCByGUID()
        .fail(function(err){
            assert.ok(false, ' -> should not have an error!')
            done();
        })
        .done(function(list){
            assert.isDefined(list, ' --> should have gotten some results ');
            assert.isArray(list, ' --> returned an array of values.');
            assert.operator(list.length, '>', 0, ' --> returned some values');

            var foundInactive = false;
            list.forEach(function(entry){
                if (entry.nssren_isActive == 0) {
                    foundInactive = true;
                }
            });
            assert.isFalse(foundInactive, ' --> no inactive entries.');
            done();
        })

    });



    it('calling .staffForNSCByGUID with empty [] of guids returns 0 staff ... ',function(done){

        LegacyStewardwise.staffForNSCByGUID({ guids:[] })
        .fail(function(err){
            assert.ok(false, ' -> should not have an error!')
            done();
        })
        .done(function(list){
            assert.isDefined(list, ' --> should have gotten some results ');
            assert.isArray(  list, ' --> returned an array of values.');
            assert.operator(list.length, '==', 0, ' --> returned some values');

            // var foundInactive = false;
            // list.forEach(function(entry){
            //     if (entry.nssren_isActive == 0) {
            //         foundInactive = true;
            //     }
            // });
            // assert.isFalse(foundInactive, ' --> no inactive entries.');
            done();
        })

    });



    it('calling .staffForNSCByGUID with [] of invalid guids returns 0 staff ... ',function(done){

        LegacyStewardwise.staffForNSCByGUID({ guids:[ 'a', 'b', 'c'] })
        .fail(function(err){
            assert.ok(false, ' -> should not have an error!')
            done();
        })
        .done(function(list){
            assert.isDefined(list, ' --> should have gotten some results ');
            assert.isArray(  list, ' --> returned an array of values.');
            assert.operator(list.length, '==', 0, ' --> returned no values');

            done();
        })

    });



    it('calling .staffForNSCByGUID with filter overrides default isActive value ... ',function(done){

        LegacyStewardwise.staffForNSCByGUID({ filter:{ nssren_isActive:0 }})
        .fail(function(err){
            assert.ok(false, ' -> should not have an error!');
            AD.log.error('... error with filter: ', err);
            done();
        })
        .done(function(list){
            assert.isDefined(list, ' --> should have gotten some results ');
            assert.isArray(list, ' --> returned an array of values.');
            assert.operator(list.length, '>', 0, ' --> returned some values');

            var foundActive = false;
            list.forEach(function(entry){
                if (entry.nssren_isActive > 0) {
                    foundActive = true;
                }
            });
            assert.isFalse(foundActive, ' --> no active entries.');
            done();
        })

    });



 });


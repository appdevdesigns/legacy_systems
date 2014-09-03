
var path = require('path');
var fs = require('fs');
var AD = require('ad-utils');
var async = require('async');


var service = null;
var sails = null;


var assert = require('chai').assert;
describe('test LegacySystems._resolveOptions()',function(){


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



            // // prepare data : AD.test.db.init( sails, [ { 'modelName':file/path/data.js'}, ...])
            // function(next) {


            //     var definitions = [
            //         {model:LNSSCoreNSC, key:'nsc_id',               path:path.join(process.cwd(), 'setup', 'test_data', 'data_nss_nsc.js' )},
            //         {model:LNSSCoreNSCTerritory, key:'coverage_id', path:path.join(process.cwd(), 'setup', 'test_data', 'data_nss_nsc_territory.js' )},
            //         {model:LNSSRen, key:'nssren_id',                path:path.join(process.cwd(), 'setup', 'test_data', 'data_nss_ren.js' )}
                    
            //         // {model:LNSSCoreNSC, path:path.join(process.cwd(), 'setup', 'test_data', 'data_nss_nsc.js' )}
            //     ];

            //     AD.test.data.load(definitions)
            //     .fail(function(err){
            //         next(err);
            //     })
            //     .done(function(){
            //         next();
            //     });
                  
            // },



            // // service = AD.test.service(sails, 'LegacyStewardwise');
            // function(next) {
            //     service = LegacyStewardwise.staffForNSCByGUID;

            //     next();
            // }


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

        // AD.test.data.restore([LNSSCoreNSC])
        // .fail(function(err){
        //     done(err);
        // })
        // .done(function(){
        //     done();
        // });
        done();

    });



    it('calling ._resolveOptions() with no parameters should result in proper default values:',function(){

        var options = LegacySystems._resolveOptions();
        assert.isUndefined(options.guids, ' --> no list key provided');
        assert.isArray(options.populate, ' --> populate defaulted to [] ');
        assert.isObject(options.filter, ' --> filter defaulted to {} ');

        assert.isDefined(options._, ' --> no pkList value results in a _ field');
        assert.isNull(options._ , ' --> unspecified pklist values will result in null value');

    });



    it('calling ._resolveOptions() with a string for options should result in an [] for lookup field: ',function(){

        var options = LegacySystems._resolveOptions('a,b,c', 'guids');
        assert.isDefined(options.guids, ' --> no list key provided');
        assert.isArray(options.guids, ' --> lookup fields is an array');
        assert.sameMembers(options.guids, ['a', 'b', 'c'], ' --> had our expected csv values. ');

        assert.isArray(options.populate, ' --> populate defaulted to [] ');
        assert.isObject(options.filter, ' --> filter defaulted to {} ');

    });



    it('calling ._resolveOptions() with {} results in proper initialization : ',function(){

        var testFilter = { a:'a', b:'b', c:'c'};

        var options = LegacySystems._resolveOptions({ guids:['a','b','c'], populate:['x','y','z'], filter:testFilter}, 'guids');
        assert.isDefined(options.guids, ' --> no list key provided');
        assert.isArray(options.guids, ' --> lookup fields is an array');
        assert.sameMembers(options.guids, ['a', 'b', 'c'], ' --> had our expected values. ');

        assert.isArray(options.populate, ' --> populate defaulted to [] ');
        assert.sameMembers(options.populate, ['x', 'y', 'z'], ' --> had our expected values. ');
        
        assert.isObject(options.filter, ' --> filter defaulted to {} ');
        for (var t in testFilter) {
            assert.property(options.filter, t, ' --> has expected property: '+t);
            assert.propertyVal(options.filter, t, testFilter[t], ' --> has expected property value: '+t+' : '+ testFilter[t]);
        }

    });





 });


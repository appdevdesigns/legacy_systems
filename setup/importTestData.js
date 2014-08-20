/**
 * Bootstrap
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */
var path = require('path');
var fs = require('fs');
var AD = require('ad-utils');


module.exports = function (cb) {

    if (sails.config.legacy_systems.generate_test_data) {

        var generator = require(path.join(__dirname, 'generate_test_data', 'generator.js'));
        generator(cb);


    } else if (sails.config.legacy_systems.import_test_data) {


        var importor = require(path.join(__dirname, 'test_data', 'importor.js'));
        importor(cb);


    } else {

        cb();
    }


};

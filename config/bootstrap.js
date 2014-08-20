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

module.exports = function (cb) {


	var importTestData = require(path.join(__dirname, '..', 'setup', 'importTestData.js'));

	if (importTestData) importTestData(cb);
 	else  cb();       // successful response

    // cb(err);   // in case of an unrecoverable error
};
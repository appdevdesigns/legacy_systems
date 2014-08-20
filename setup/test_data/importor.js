/**
 * importor.js
 *
 * This routine will step you through the process of importing test data for use
 * in our legacy systems db tables.
 *
 */
var path = require('path');
var fs = require('fs');
var AD = require('ad-utils');


/////// taskList: an [] of we are supposed to perform for generating data.
/////// 
var taskList = require('../test_options.js');



/////// processors:  an object that represents the tasks we know about.
///////              AD.testData.generate.tasks() // contains some common tasks
///////              we can add to this list for more customized tasks.
var processors = AD.testData.import.tasks();    // list of fn() called to process incoming data.




var Log = function() {
    var newArgs = [];
    for (var i=0; i<arguments.length; i++) {
        newArgs.push(arguments[i]);
    }
    newArgs.unshift('<green>legacy_systems.importTestData():</green> ');
    AD.log.apply( null , newArgs);
}



module.exports = function (cb) {

    AD.log();
    AD.log();

    // setup a special logger fn()
    processors.logger(Log);


    // now call the import.do() with our todos and Tasks
    AD.testData.import.do({
        toDo:taskList,
        tasks:processors
    }, function(err){

        if (err) {
            AD.log.error('... importing task data failed: ', err);
        }
        cb(err);
    });

};







//----------------------------------------------------------------------------
// Custom Tasks for our Legacy Data 
//----------------------------------------------------------------------------






/**
 * @function mixRenNewGUID
 *
 * Map the values in data A.field = B.field.
 *
 * When we are finished, all the values in A.field will match those in B.field.
 *
 * @param [string] dataRef          : the global id of the data we are modifying
 * @param [string] dataRefRen       : the global id of the people/ren values
 * @param [string] field            : the name of the field to use for mapping the values (shared by both)
 * @param [string] newValue         : the field that has the new guid in it
 * @param [array]  skipValues       : don't perform the swap for any data.field values that are in this array
 */
processors.mixRenNewGUID = function(options, next){
    var dfd = AD.sal.Deferred();

  
    dfd.resolve();
    
    return dfd;
}




/**
 * @function obscureDonBatch
 *
 * Update the Don Batch entries to have intelligent NSC Names from our existing data..
 *
 * @param [string] dataRef        : the global id of the Don Batch data
 * @param [obj]    keys             : a hash of data references for the additional data we need :
 *                                      ren : key_people
 *                                      nsc : key_nsc
 *                                      territory: key_territory data
 */
processors.obscureDonBatch = function(options, next){
    var dfd = AD.sal.Deferred();


    dfd.resolve();
    
    return dfd;
}




/**
 * @function splitReplaceField
 *
 * split a field, then replace every value with replaceChars.
 *
 * @param [string] dataRef        : the global id of the array of objects to work with
 * @param [string] fields           : the field names we want to modify
 * @param [string] splitOn          : which character to .split() on
 * @param [string] replaceChar      : which character to use to replace the values with 
 */
processors.splitReplaceField = function(options, next){
    var dfd = AD.sal.Deferred();

    dfd.resolve();
    
    return dfd;
}




/**
 * @function pullFamilyData
 *
 * Pull the family data from the provided model.  
 *
 * You are asked how many entries to pull.
 *
 * @param [string] model        : which model to use for the family data
 * @param [string] dataRef      : the data key to store the family data under
 */
processors.pullFamilyData = function(entry, next){

    var dfd = AD.sal.Deferred();
    
    dfd.resolve();
  
   return dfd;

}




/**
 * @function pullPersonData
 *
 * Pull the ren/person data from the DB.  
 *
 *
 * @param [string] model        : which model to use for the person data
 * @param [string] dataRef      : the data key to store the person data under
 * @param [string] keyFamily    : the data key for all the family info (we limit people by existing family entries) 
 */
processors.pullPersonData = function(entry, next){
    var dfd = AD.sal.Deferred();

    dfd.resolve();

    return dfd;
}




/*
 * @function updatePersonGUIDs
 *
 * Process each of the person entries and update the ren_guid = new_ren_guid.
 *
 * Delete all the new_ren_guid fields.
 *
 * @param [string] dataRef      : the data key of the person entries
 */
processors.updatePersonGUIDs = function(entry, next){
    var dfd = AD.sal.Deferred();

    dfd.resolve();

    return dfd;
}









//----------------------------------------------------------------------------
// Helper Routines
//----------------------------------------------------------------------------




// /*
//  * @function readIt
//  *
//  * Read in the data description from a specified file.
//  *
//  * @param {string} fileName   The name of the test file to read in.
//  *                            NOTE: expected to be in the same directory of this file.
//  * @param {fn} cb  The callback fn(err, data) to use when this operation is finished.
//  */
// var readIt = function(fileName, cb) {

//     var dfd = AD.sal.Deferred();

//     fs.readFile(path.join(__dirname, fileName), 'utf8', function(err, data) {
// //console.log('fileName:'+fileName);
//         if (err) {
//             if (cb) cb(err);
//             dfd.reject(err);
//         } else {
//             var jData = JSON.parse(data);
//             if (cb) cb(null, jData);
//             dfd.resolve(jData);
//         }
//     });

//     return dfd;

// }

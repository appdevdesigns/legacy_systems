/**
 * generator.js
 *
 * This routine will step you through the process of generating test data for use
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
var processors = AD.testData.generate.tasks();    // list of fn() called to process incoming data.




var Log = function() {
    var newArgs = [];
    for (var i=0; i<arguments.length; i++) {
        newArgs.push(arguments[i]);
    }
    newArgs.unshift('<green>legacy_systems.generateTestData():</green> ');
    AD.log.apply( null , newArgs);
}



module.exports = function (cb) {

    AD.log();
    AD.log();

    // setup a special logger fn()
    processors.logger(Log);


    // now call the generate.do() with our todos and Tasks
    AD.testData.generate.do({
        toDo:taskList,
        tasks:processors
    }, function(err){

        if (err) {
            AD.log.error('... generating task data failed: ', err);
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

    options.skipValues = options.skipValues || [];


    var renList = this.datastore(options.dataRefRen);
// AD.log('... mixRenNewGUID: renList:'+renList.length);

   // make a clone of the renData array (so we don't mess with that data for later steps)
    var cloneRenData = [];
    var existingRenHash = {};
    renList.forEach(function(ren){

        // for our purposes here, we only want to work with family poc's
        if (ren.ren_isfamilypoc == 1) {
            cloneRenData.push(ren);
        }

        // here I want { guid : newGuid }  AND { newGuid: newGuid }
        existingRenHash[ren[options.field]] = ren[options.newValue];
        existingRenHash[ren[options.newValue]] = ren[options.newValue];
    })



    //// Update the Data
    var notSoFinalData = [];
    var usedHash = {};

    var listData = this.datastore(options.dataRef);
// AD.log('... mixRenNewGUID -> listData:'+listData.length);

    // 1st pass:  connect existing matches:
    listData.forEach(function(data){

        // if this isn't a value we are told to skip
        if (options.skipValues.indexOf(data[options.field]) == -1) {

            // only update the ones with valid entries right now.
            if (existingRenHash[ data[options.field] ]) {

                // mark this entry as used.
                usedHash[ data[options.field] ] = true;
// AD.log('... existing guid:'+data[options.field]+'   => '+ existingRenHash[ data[options.field] ]);
                // nsc.ren_guid = ren.ren_guid
                data[options.field] = existingRenHash[ data[options.field] ];

                // mark the new one as used as well:
                usedHash[ data[options.field] ] = true;
            }

        }

        notSoFinalData.push(data);
        
    });


    // 2nd pass:  make sure unconnected values actually connect now!
    var finalData = [];
    notSoFinalData.forEach(function(data){


        // if this isn't a value we are told to skip
        if (options.skipValues.indexOf(data[options.field]) == -1) {

            // if the value is not in the usedHash:
            if (typeof usedHash[ data[options.field] ] == 'undefined') {

                //pull new clones until there isn't a match with usedHash
                var matchThis = cloneRenData.shift();
                while( (matchThis) && (usedHash[matchThis[options.field]])) {
                    matchThis = cloneRenData.shift();
                }

                if (matchThis) {

// AD.log();
// AD.log('... matching guid:'+data[options.field]+'   => '+ existingRenHash[ matchThis[options.field] ]);
// AD.log('... data:', data);
// AD.log('... options.field:'+ options.field);
// AD.log('... data['+options.field+'] : '+data[options.field]);

                    data[options.field] = existingRenHash[ matchThis[options.field] ];

                    // mark the new one as used as well:
                    usedHash[ data[options.field] ] = true;

                } else {

                    AD.log('... ran out of cloned people to match guids with.');
                }
            }
        }
        finalData.push(data);
    })

    // now save this 
    this.datastore(options.dataRef, finalData);
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


    // createa  { ren_guid: 'name' }  lookup:
    var renNames = {};
    this.datastore(options.keys.ren).forEach(function(entry){
        var guid = entry.ren_guid;
        // but if the new_ren_guid is still present, use that one instead:
        if (entry.new_ren_guid) guid = entry.new_ren_guid;
        renNames[guid] = entry.ren_surname+', '+entry.ren_preferredname;
    })

    // now create a { nsc_id: 'name' } lookup
    var nscNames = {};
    this.datastore(options.keys.nsc).forEach(function(entry){
        nscNames[entry.nsc_id] = renNames[entry.ren_guid];
    })
// AD.log('... nscNames:', nscNames);

    // now create a {territory_id: 'name' } lookup:
    var territoryNames = {};
    this.datastore(options.keys.territory).forEach(function(entry){

        if (nscNames[entry.nsc_id]) {
            territoryNames[entry.territory_id] = nscNames[entry.nsc_id];
        }
    })
// AD.log('... territoryNames:', territoryNames);

    // now update the DonBatch info with these names by territory
    var finalData = [];
    this.datastore(options.dataRef).forEach(function(entry){
        if (territoryNames[entry.nsc_territory_id]) {
            entry.donBatch_nscName = territoryNames[entry.nsc_territory_id];
        } else {
            AD.log('    <yellow>warn:</yellow> could not resolve territory id['+entry.nsc_territory_id+'] into a name.  So assign it to Agent Coulson.')
            entry.donBatch_nscName = 'Coulson, Phil (Agent)';
        }
        finalData.push(entry);
    })

    this.datastore(options.dataRef, finalData);
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

    options.fields = options.fields || [];
    options.splitOn = options.splitOn || ' ';
    options.replaceChar = options.replaceChar || '.';


    var dotIt = function(term) {
        var newTerm = '';
        for (var t=0; t<term.length; t++) { newTerm += options.replaceChar; }
        return newTerm;
    }


    var data = this.datastore(options.dataRef);
    var finalData = [];
    data.forEach(function(entry){

        options.fields.forEach(function(field){


            var parts = entry[field].split(options.splitOn);

            // replace any secondary terms with '....'
            for (var p=1; p<parts.length; p++) {

                parts[p] = dotIt(parts[p]);
            }

            // recombine entry description from it's parts:
            entry[field] = parts.join(options.splitOn);

        })

        // // modify 1st term if Intl-:
        // if (parts[0].indexOf('Int\'l') != -1) {
        //     var sections = parts[0].split('-');
        //     for (var s=1; s<sections.length; s++) {
        //         sections[s] = dotIt(sections[s]);
        //     }

        //     parts[0] = sections.join('-');

        // }

        finalData.push(entry);

    });


    this.datastore(options.dataRef, finalData);

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
    var self = this;

    var Model = sails.models[entry.model.toLowerCase()];


    Model.count()
    .fail(function(err){

        AD.log.error(' could not look up existing family info ...', err);
        if (next) next(err);
        dfd.reject(err);

    })
    .then(function(count){

        AD.log();
        AD.log();
        AD.log('There are currently '+count+' families in the db. ');

        if (count > 500) count = 500;  // default to max 500 entries

        var qset =  {
            question: 'how many do you want to export:',
            data: 'length',
            def : count
        };

        AD.cli.questions(qset)
        .fail(function(err){
            if (next) next(err);
            dfd.reject(err);
        })
        .then(function(data){

            Model.find().limit(data.length)
            .fail(function(err){
                AD.log();
                AD.log.error(' error retrieving family entries: ', err);
                if (next) next(err);
                dfd.reject(err);
            })
            .then(function(list){
                // globalData[entry.dataRef] = list;
                self.datastore(entry.dataRef, list);
                if(next) next();
                dfd.resolve(list);

                // var jsonData = JSON.stringify(list,null,4);
                // writeIt('gen_family.js', jsonData, next);
            })
            .done();

        })
        .done();

    })
  
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
    var self = this;

    async.parallel({

        // 'testdata_HRIS_ren.js'
        MaleNames: function(cb) {
            readIt('data_names_male.js', cb);
        },

        FemaleNames: function(cb) {
            readIt('data_names_female.js', cb);
        }

    }, function(err, results){
        if (err) {

            if (next) next(err);
            dfd.reject(err);

        } else {

// console.log('... got Namez! ['+results.MaleNames.length+'] ['+results.FemaleNames.length+']');

            // now pull any person data associated with the Families we just read in:
            var listFamilyIDs = [];
            self.datastore(entry.keyFamily).forEach(function(family){
                listFamilyIDs.push(family.family_id);
            })

            var Model = sails.models[entry.model.toLowerCase()];
            Model.find({family_id:listFamilyIDs})
            .fail(function(err){

                AD.log();
                AD.log.error('Unable to read in existing Person info: ', err);
                if (next) next(err);
                dfd.reject(err);

            })
            .then(function(list){

 //               AD.log('... there are <yellow>'+list.length+' people</yellow> associated with these families');

                var template = {
                    ren_surname:1,
                    ren_givenname:1,
                    ren_namecharacters:1,
                    ren_namepinyin:1,
                    ren_preferredname:1
                }

                var updatedList = [];
                list.forEach(function(person){

                    var nameEntry = null;
                    if (person.gender_id == 3) {
                        nameEntry = results.MaleNames.shift();

                        if (results.MaleNames.length ==0) {
                            results.MaleNames.push(nameEntry);
                            AD.log('<yellow> out of male names ... reusing last one...</yellow>');
                        }
                    } else {
                        nameEntry = results.FemaleNames.shift();
                        if (results.FemaleNames.length ==0) {
                            results.FemaleNames.push(nameEntry);
                            AD.log('<yellow> out of female names ... reusing last one...</yellow>');
                        }
                    }

                    for (var t in template) {
                        person[t] = nameEntry[t];
                    }

                    // for now keep the existing one to help find matches with existing data:
                    person.new_ren_guid = nameEntry.ren_guid;

                    updatedList.push(person);
                })

                self.datastore(entry.dataRef, updatedList);

                if (next) next();
                dfd.resolve(updatedList);

            })
            .done();

        }
    });
  
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

    // update the guid fields:
    var newList = [];
    this.datastore(entry.dataRef).forEach(function(person){
        person.ren_guid = person.new_ren_guid;
        delete person.new_ren_guid;
        newList.push(person);
    })

    this.datastore(entry.dataRef, newList);

    if (next) next();
    dfd.resolve(newList);
    
    return dfd;
}









//----------------------------------------------------------------------------
// Helper Routines
//----------------------------------------------------------------------------




/*
 * @function readIt
 *
 * Read in the data description from a specified file.
 *
 * @param {string} fileName   The name of the test file to read in.
 *                            NOTE: expected to be in the same directory of this file.
 * @param {fn} cb  The callback fn(err, data) to use when this operation is finished.
 */
var readIt = function(fileName, cb) {

    var dfd = AD.sal.Deferred();

    fs.readFile(path.join(__dirname, fileName), 'utf8', function(err, data) {
//console.log('fileName:'+fileName);
        if (err) {
            if (cb) cb(err);
            dfd.reject(err);
        } else {
            var jData = JSON.parse(data);
            if (cb) cb(null, jData);
            dfd.resolve(jData);
        }
    });

    return dfd;

}

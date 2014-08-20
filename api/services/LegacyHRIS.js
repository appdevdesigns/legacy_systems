var path = require('path');
// var $ = require('jquery-deferred');
var AD = require('ad-utils');


var Log = function() {
    var newArgs = [];
    for (var i=0; i<arguments.length; i++) {
        newArgs.push(arguments[i]);
    }
    newArgs.unshift('<green>LegacyHRIS:</green> ');
    AD.log.apply( null , newArgs);
}



// listPeopleSpecialLookups : a list of optional 'populate' commands that we can additionally handle
//                        these are not part of the LHRISRen model definition
var listPeopleSpecialLookups = ['staffAccounts'];


module.exports= {


        _resolveOptionsByGUID:function(options){

            // if nothing set to empty values
            options = options || { guids:[], populate:[], filter:{} };    // default to none


            // did they send us a csv string?
            // peopleByGUID('guid1, guid2, ..., guidN') :=>
            if (typeof options == 'string') {
                options = { guids: options.split(','), populate:[], filter:{} };
            }
            

            // make sure populate is valid.
            options.populate = options.populate || [];

            // make sure there is a filter value:
            options.filter = options.filter || {};


            return options;
        },



        /**
         *  @function peopleByGUID
         *
         *  Return an array of HRIS Ren who have one of the given GUIDs.
         *
         *  @param [object] options     : list of options
         *                  options.guids : list of ren guids
         *                  options.populate : list of related fields to populate results with.
         *                      each entry can either be a:
         *                          'string' : 'email' : populate('email')
         *                          'object' : {key:'email', filter:{email_issecure:1}}
         *                  options.filter   : additional filter for who to pull out
         *
         *  @return [array] 
         */
        peopleByGUID:function( options ) {
            var dfd = AD.sal.Deferred();
            var self = this;


            //// 
            //// do some error checking on our given options:
            ////
            options = self._resolveOptionsByGUID(options);


            // verify filter value
            var filter = options.filter || {};


            // if guids are provided, just add that to filter now:
            if (options.guids.length > 0) {
                filter.ren_guid = options.guids;
            }


            ///
            /// Seperate our populate entries
            ///
            // populate entries can be 2 types:
            //  Populated   : these are defined by the model and can be .populate() 
            //  Processed   : these are additional services we provide that can be resolved back to ren by ren_guid
            //
            var fieldsToPopulate = [];
            var fieldsToProcess  = [];
            options.populate.forEach(function(field){

                var key = field;
                if (typeof field != 'string') {
                    key = field.key;
                }
                // if this field isn't in our special lookups then add it to Populate
                if (listPeopleSpecialLookups.indexOf(key) == -1) {
                    fieldsToPopulate.push(field);
                } else {
                    // else add to Process
                    fieldsToProcess.push(field);
                }
                
            })
// AD.log('fieldsToPopulate: ', fieldsToPopulate);



            ///
            /// OK, now do the find()
            ///

            // .find() with our given filter.
            var p = LHRISRen.find(filter);

            // .populate() any specified fields
            fieldsToPopulate.forEach(function(populate){
                if (typeof populate == 'string') {
                    p.populate(populate);
                } else {
// AD.log('... populating by filter key['+populate.key+'] and filter:', populate.filter);
                    p.populate(populate.key, populate.filter);
                }
            })

            // resolve the action.
            p.fail(function(err){
                AD.log.error('failed looking up LHRISRen: options:', options,' \n error:', err);
                dfd.reject(err);
            })
            .then(function(listRen){

                // if there were no additional fields to Process -> we're done!
                if (fieldsToProcess.length == 0) {
                    dfd.resolve(listRen);
                } else {


                    // all our additional fields will require 
                    var listGUIDs = arrayOf('ren_guid', listRen);
                    var fieldsDone = 0;
                    fieldsToProcess.forEach(function(processMe){

                        if (typeof processMe == 'string') {
                            processMe = { key:processMe, filter:{} };
                        }

                        // if we have a corresponding ...ByGUID():
                        var fnKey = processMe.key+'ByGUID';
                        if (self[fnKey]) {

                            self[fnKey]({guids:listGUIDs, filter:processMe.filter })
                            .fail(function(err){
                                AD.log('... fieldToProcess entry failed.  field:', processMe,'  \n err:', err);
                                dfd.reject(err);
                            })
                            .then(function(values){

                                // our fn() return arrays so convert into a hash on ren_guid
                                var hash = toHash('ren_guid', values);

                                // merge that data back into our ren
                                listRen.forEach(function(ren){
                                    if (hash[ren.ren_guid]) {
                                        ren[processMe.key] = hash[ren.ren_guid];
                                    }
                                })

                                // mark this one done and return if we are finished
                                fieldsDone++;
                                if (fieldsDone >= fieldsToProcess.length){
                                    dfd.resolve(listRen);
                                }

                            })

                        }
                    })

                }

            })
            .done();

            return dfd;
        },


        staffAccountsByGUID:function(options){
            var dfd = AD.sal.Deferred();
            var self = this;

            //// 
            //// do some error checking on our given options:
            ////
            options = self._resolveOptionsByGUID(options);


            // prepare our filter:
            var renFilter = {};
            if (options.guids.length > 0) {
                renFilter.ren_guid = options.guids;
            }

            // to return Accounts, we need all the HRISRen by guid
            LHRISRen.find(renFilter)
            .fail(function(err){
                AD.log.error('... staffAccountByGUID() failed LHRISRen lookup: renFilter:', renFilter, '\n err:', err);
                dfd.reject(err);
            })
            .done(function(listRen){

                // then pull family_ids
                var listFamilyIDs = arrayOf('family_id', listRen);
                var hashFamilyToRen = toHash('family_id', listRen);



                // then lookup LHRISAccount.find(family_id:listFamilyIDs);
                var accountFilter = options.filter;
                accountFilter.family_id = listFamilyIDs;
                LHRISAccount.find(accountFilter)
                .fail(function(err){

                    AD.log.err('... staffAccountByGUID() failed LHRISAccount lookup: accountFilter:', accountFilter, '\n err:', err);
                    dfd.reject(err);
                })
                .done(function(listAccounts){

                    // all our xxxByGUID() routines need to include a ren_guid field in their values:
                    listAccounts.forEach(function(account){

                        if (hashFamilyToRen[account.family_id]) {

if (hashFamilyToRen[account.family_id].length > 1) {
    AD.log('<yellow><bold>warn:</bold> LegacyHRIS.staffAccountsByGUID() : > 1 ren with given family_id. </yellow> ');
}

                            // hashes return arrays of values
                            // make sure we reference the 1st entry in our hash!
                            account.ren_guid = hashFamilyToRen[account.family_id][0].ren_guid;
                        }
                    })

                    dfd.resolve(listAccounts);

                })

            })


            return dfd;
        }

}










var arrayOf = function(field, list) {
    var result = [];
    list.forEach(function(entry){
        if (entry[field]){
            result.push(entry[field]);
        }
    })
    return result;
}





var toHash = function(field, list) {
    var result = {};
    list.forEach(function(entry){
        if (entry[field]){
            if (typeof result[entry[field]] == 'undefined') {
                result[entry[field]] = [];
            }
            result[entry[field]].push(entry);
        }
    })
    return result;
}

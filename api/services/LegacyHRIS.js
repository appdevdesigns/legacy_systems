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
var listPeopleSpecialLookups = ['staffAccounts', 'phones', 'emails' ];


module.exports= {


        _resolveOptionsByFamID:function(options){

            // if nothing set to empty values
            options = options || { familyids:[], populate:[], filter:{} };    // default to none


            // did they send us a csv string?
            // ******ByFamID('id1, id2, ..., idN') :=>
            if (typeof options == 'string') {
                options = { familyids: options.split(','), populate:[], filter:{} };
            }
            

            // make sure populate is valid.
            options.populate = options.populate || [];

            // make sure there is a filter value:
            options.filter = options.filter || {};


            return options;
        },


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


        _resolveOptionsByRenID:function(options){

            // if nothing,  set to empty values
            options = options || { renids:[], populate:[], filter:{} };    // default to none


            // did they send us a csv string?
            // ****ByRenID('ren_id1, ren_id2, ..., ren_idN') :=>
            if (typeof options == 'string') {
                options = { renids: options.split(','), populate:[], filter:{} };
            }
            

            // make sure populate is valid.
            options.populate = options.populate || [];

            // make sure there is a filter value:
            options.filter = options.filter || {};


            return options;
        },



        _resolveOptions:function(options, pkList){
// AD.log('... _resolveOptions(', options,', "'+pkList+'"")');

            // if nothing,  set to empty values
            options = options || {};    // default to none


            // did they send us a csv string?
            // ****ByRenID('ren_id1, ren_id2, ..., ren_idN') :=>
            if (typeof options == 'string') {
                var newOptions = { populate:[], filter:{} };
                newOptions[pkList] = options.split(',');
                options = newOptions;
            }

            options[pkList] = options[pkList] || [];
            

            // make sure populate is valid.
            options.populate = options.populate || [];

            // make sure there is a filter value:
            options.filter = options.filter || {};

// AD.log('... ... options:', options);

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
            options = self._resolveOptions(options, 'guids');


            // verify filter value
            var filter = options.filter || {};


            // if guids are provided, just add that to filter now:
            if (options.guids) {
                filter.ren_guid = options.guids;
            }


            ///
            /// Seperate our populate entries
            ///
            // populate entries can be 2 types:
            //  Populated   : these are defined by the model and can be .populate() 
            //  Processed   : these are additional services we provide that can be resolved back to ren by ren_guid, family_id, or ren_id
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
                    var listIDs = null;
                    var listFamIDs = null;
                    var listGUIDs = null;

                    // use this to indicate if a remap warning has been issued for one of these fields:
                    var remapWarnings = {};

                    var fieldsDone = 0;
                    fieldsToProcess.forEach(function(processMe){

                        if (typeof processMe == 'string') {
                            processMe = { key:processMe, filter:{} };
                        }

                        remapWarnings[processMe.key] = false;


                        // if we have a corresponding "<fieldname>ByGUID()" function defined:
                        var fnKeyGUID = processMe.key+'ByGUID';
                        var fnKeyID = processMe.key+'ByRenID';
                        var fnKeyFID = processMe.key+'ByFamID';
                        
                        // Processing by ren_id
                        if (self[fnKeyID]) {

                            if (listIDs == null) listIDs = arrayOf('ren_id', listRen);

                            self[fnKeyID]({renids:listIDs, filter:processMe.filter })
                            .fail(function(err){
                                AD.log('... fieldToProcess entry failed.  field:', processMe,'  \n err:', err);
                                dfd.reject(err);
                            })
                            .then(function(values){

                                // our fn() return arrays so convert into a hash on ren_guid
                                var hash = toHash('ren_id', values);

                                // merge that data back into our ren
                                listRen.forEach(function(ren){

                                    if (hash[ren.ren_id]) {

                                        //// NOTE: it might happen that we are attempting to manually merge in 
                                        ////       guid data that the LHRISRen model has an association for.
                                        ////       In this case, simply save the manually mapped data to:
                                        ////       ren._key
                                        if (ren[processMe.key]) {
                                            if (remapWarnings[processMe.key] == false) {
                                                AD.log('<yellow>warn:</yellow> ren.'+processMe.key+' found --> remapping to _'+processMe.key);
                                                remapWarnings[processMe.key] = true;
                                            }
                                            ren['_'+processMe.key] = hash[ren.ren_id];
                                        } else {
                                            ren[processMe.key] = hash[ren.ren_id];
                                        }

                                    }

                                })

                                // mark this one done and return if we are finished
                                fieldsDone++;
                                if (fieldsDone >= fieldsToProcess.length){
                                    dfd.resolve(listRen);
                                }

                            })

                        } 
                        // Processing by family_id
                        else if (self[fnKeyFID]) {

                            if (listFamIDs == null) {
                                listFamIDs = arrayOf('family_id', listRen);

                                // special case:  Associations on LHRISRen -> LHRISFamily may have 
                                // .populate('family_id')  before calling this, so convert any [ { family_id:# }, {family_id:# }, ...]
                                // into [ #, #, ... ]
                                if ('object' == typeof listFamIDs[0]) {
                                    listFamIDs = arrayOf('family_id', listFamIDs);
                                }
                            }


                            var filter = {familyids:listFamIDs, filter:processMe.filter };

                            self[fnKeyFID](filter)
                            .fail(function(err){
                                AD.log('... fieldToProcess entry failed. fn['+fnKeyFID+']  filter:', filter,'  \n err:', err);
                                dfd.reject(err);
                            })
                            .then(function(values){

                                // our fn() return arrays so convert into a hash on ren_guid
                                var hash = toHash('family_id', values);

                                // merge that data back into our ren
                                listRen.forEach(function(ren){
                                    var famID = ren.family_id;
                                    // remember the special case above:  gotta make sure our hash[famID] is
                                    // a # not an object.
                                    if ('object' == typeof famID) {
                                        famID = famID.family_id;
                                    }
                                    if (hash[famID]) {
                                        //// NOTE: it might happen that we are attempting to manually merge in 
                                        ////       family data that the LHRISRen model has an association for.
                                        ////       In this case, simply save the manually mapped data to:
                                        ////       ren._key
                                        if (ren[processMe.key]) {
                                            AD.log('... ren.'+processMe.key+' found --> remapping to _'+processMe.key);
                                            ren['_'+processMe.key] = hash[famID];
                                        } else {
                                            ren[processMe.key] = hash[famID];
                                        }
                                    }
                                })

                                // mark this one done and return if we are finished
                                fieldsDone++;
                                if (fieldsDone >= fieldsToProcess.length){
                                    dfd.resolve(listRen);
                                }

                            })

                        } 
                        // Processing by ren_guid
                        else if (self[fnKeyGUID]) {

                            if (listGUIDs == null) listGUIDs = arrayOf('ren_guid', listRen);

                            self[fnKeyGUID]({guids:listGUIDs, filter:processMe.filter })
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

                                        //// NOTE: it might happen that we are attempting to manually merge in 
                                        ////       guid data that the LHRISRen model has an association for.
                                        ////       In this case, simply save the manually mapped data to:
                                        ////       ren._key
                                        if (ren[processMe.key]) {
                                            AD.log('... ren.'+processMe.key+' found --> remapping to _'+processMe.key);
                                            ren['_'+processMe.key] = hash[ren.ren_guid];
                                        } else {
                                            ren[processMe.key] = hash[ren.ren_guid];
                                        }

                                    }

                                })

                                // mark this one done and return if we are finished
                                fieldsDone++;
                                if (fieldsDone >= fieldsToProcess.length){
                                    dfd.resolve(listRen);
                                }

                            })

                        } else {

                            // there was no fn() like this so ...
                            AD.log('<yellow><bold>warn:</bold> no known processor for <red>['+processMe.key+']</red>');
                        }
                    })

                }

            })
            .done();

            return dfd;
        },







     






        //--------------------------------------------------------------------
        //  StaffAccount  Lookups
        //--------------------------------------------------------------------
        /**
         *  @function staffAccountsByFamID
         *
         *  Return an array of HRIS Accounts who have one of the given FamilyIDs.
         *
         *  @param [object] options     : list of options
         *                  options.familyids : list of family_id values
         *                  options.populate : list of related fields to populate results with.
         *                      each entry can either be a:
         *                          'string' : 'email' : populate('email')
         *                          'object' : {key:'email', filter:{email_issecure:1}}
         *                  options.filter   : additional filter for who to pull out
         *
         *  @return [array] 
         */
        staffAccountsByFamID:function(options){
            var dfd = AD.sal.Deferred();
            var self = this;

            //// 
            //// do some error checking on our given options:
            ////
            options = self._resolveOptions(options, 'familyids');


            // prepare our filter:
            var filter = options.filter;
            if (options.familyids.length > 0) {
                if (filter.family_id) {
                    AD.log('<yellow><bold>warn:</bold></yellow> possible family_id conflict in call to staffAccountsByFamID(), options:', options);
                    AD.log('... options.familyids takes precedence');
                }
                filter.family_id = options.familyids;
            }


            // then lookup LHRISAccount.find(family_id:listFamilyIDs);
            LHRISAccount.find(filter)
            .fail(function(err){
                
                AD.log.error('... staffAccountByFamID() failed LHRISAccount lookup: filter:', filter, '\n err:', err);
                dfd.reject(err);
            })
            .done(function(listAccounts){
                for (var i=0; i<listAccounts.length; i++) {
                    // If account number is in the Narnia account format 
                    // (e.g. 1-0-0345) then truncate to just the final 4 digits
                    var narniaAccount = listAccounts[i].account_number.match(/^\d-\d-(\d\d\d\d)$/);
                    if (narniaAccount) {
                        listAccounts[i].account_number = narniaAccount[1];
                    }
                }
                dfd.resolve(listAccounts);

            })

            return dfd;
        },



        /**
         *  @function staffAccountsByGUID
         *
         *  Return an array of HRIS Accounts who have one of the given ren_guids.
         *
         *  @param [object] options     : list of options
         *                  options.guids    : list of ren_guid values
         *                  options.populate : list of related fields to populate results with.
         *                      each entry can either be a:
         *                          'string' : 'email' == populate('email')
         *                          'object' : {key:'email', filter:{email_issecure:1}}
         *                  options.filter   : additional filter for who to pull out
         *  
         *  @return [array] 
         */
        staffAccountsByGUID:function(options){
            var dfd = AD.sal.Deferred();
            var self = this;

            //// 
            //// do some error checking on our given options:
            ////
            options = self._resolveOptionsByGUID(options);


            // prepare our filter:
            // NOTE: the options.filter actually relates to the LHRISAccount.find() operation,
            //       not this one.
            var renFilter = {};
            if (options.guids.length > 0) {
                renFilter.ren_guid = options.guids;
            }

            // to return Accounts, we first need all the HRISRen by guid
            LHRISRen.find(renFilter)
            .fail(function(err){
                AD.log.error('... staffAccountByGUID() failed LHRISRen lookup: renFilter:', renFilter, '\n err:', err);
                dfd.reject(err);
            })
            .done(function(listRen){

                //// then pull our staffAccountsByFamID():

                var listFamilyIDs = arrayOf('family_id', listRen);
                var hashFamilyToRen = toHash('family_id', listRen);

                var accountFilter = {
                    familyids:listFamilyIDs, 
                    populate:options.populate, 
                    filter:options.filter
                }

                LegacyHRIS.staffAccountsByFamID(accountFilter)
                .fail(function(err){

                    AD.log.err('... staffAccountByGUID() failed LegacyHRIS.staffAccountByFamID() lookup: accountFilter:', accountFilter, '\n err:', err);
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












var listRenIDLookups = ['emails', 'phones'];
var modelLookup = {

    'emails': function() { return LHRISEmail; },
    'phones': function() { return LHRISPhone; }
}



var applyRenIDLookup = function(resourceKey) {

    // var resourceKey = opt.resource;     // 'phones'

    var idListKey = 'renids';
    var idKey = 'ren_id';

    createLookups( resourceKey, idListKey, idKey, resourceKey+'ByRenID', resourceKey+'ByGUID');
}




var createLookups = function( resource, idListKey, idKey, fnKeyID, fnKeyGUID) {


    module.exports[fnKeyID] = function(options){
// AD.log('... pkLookup(): resource['+resource+'] idListKey['+idListKey+'] idKey['+idKey+'] fnKeyID['+fnKeyID+'] fnKeyGUID['+fnKeyGUID+']');

        var dfd = AD.sal.Deferred();
        var self = this;

        //// 
        //// do some error checking on our given options:
        ////
        options = self._resolveOptions(options, idListKey);


        // prepare our filter:
        var filter = options.filter;
        if (options[idListKey].length > 0) {
            if (filter[idKey]) {
                AD.log('<yellow><bold>warn:</bold></yellow> possible '+idKey+' conflict in call to '+resource+'ByRenID(), options:', options);
                AD.log('... options.'+idListKey+' takes precedence');
            }
            filter[idKey] = options[idListKey];
        }

        if (modelLookup[resource]) {

            var Model = modelLookup[resource]();  // <--- returns the Model to use
            // then lookup LHRISPhone.find();
            Model.find(filter)
            .fail(function(err){

                AD.log.error('... '+resource+'ByRenID() failed Model lookup: filter:', filter, '\n err:', err);
                dfd.reject(err);
            })
            .done(function(listItems){

                dfd.resolve(listItems);

            })

        } else {

            AD.log.error('<bold>error:</bold> resource ['+resource+'] not found in modelLookup!');
            dfd.reject(new Error('resource ['+resource+'] not found in modelLookup!'));
        }

        return dfd;
    }



    /**
     *  @function fnKeyGUID
     *
     *  Return an array of Resources who have one of the given ren_guids.
     *
     *  @param [object] options     : list of options
     *                  options.guids    : list of ren_guid values
     *                  options.populate : list of related fields to populate results with.
     *                      each entry can either be a:
     *                          'string' : 'email' == populate('email')
     *                          'object' : {key:'email', filter:{email_issecure:1}}
     *                  options.filter   : additional filter for who to pull out
     *  
     *  @return [array] 
     */
    module.exports[fnKeyGUID] = function(options){
// AD.log('... guidLookup(): resource['+resource+'] idListKey['+idListKey+'] idKey['+idKey+'] fnKeyID['+fnKeyID+'] fnKeyGUID['+fnKeyGUID+']');
        var dfd = AD.sal.Deferred();
        var self = this;

        //// 
        //// do some error checking on our given options:
        ////
        options = self._resolveOptions(options, 'guids');


        // prepare our filter:
        // NOTE: the options.filter actually relates to the LegacyHRIS[fnKeyID]() operation,
        //       not this one.
        var renFilter = {};
        if (options.guids.length > 0) {
            renFilter.ren_guid = options.guids;
        }

        // to return Phones, we first need all the HRISRen by guid
        LHRISRen.find(renFilter)
        .fail(function(err){
            AD.log.error('... '+fnKeyGUID+'() failed LHRISRen lookup: renFilter:', renFilter, '\n err:', err);
            dfd.reject(err);
        })
        .done(function(listRen){

            //// then pull our phonesByRenID():

            var listIDs = arrayOf(idKey, listRen);
            var hashIDToRen = toHash(idKey, listRen);

            var actualFilter = {
                populate:options.populate, 
                filter:options.filter
            }
            actualFilter[idListKey] = listIDs;

            LegacyHRIS[fnKeyID](actualFilter)
            .fail(function(err){

                AD.log.err('... '+fnKeyGUID+'() failed LegacyHRIS.'+fnKeyID+'() lookup: actualFilter:', actualFilter, '\n err:', err);
                dfd.reject(err);
            })
            .done(function(listData){

                // all our xxxByGUID() routines need to include a ren_guid field in their return values:
                listData.forEach(function(item){

                    if (hashIDToRen[item[idKey]]) {

if (hashIDToRen[item[idKey]].length > 1) {
AD.log('<yellow><bold>warn:</bold> LegacyHRIS.'+fnKeyGUID+'() : > 1 ren with given '+idKey+'. </yellow> ');
}

                        // hashes return arrays of values
                        // make sure we reference the 1st entry in our hash!
                        item.ren_guid = hashIDToRen[item[idKey]][0].ren_guid;
                    }
                })

                dfd.resolve(listData);

            })

        })


        return dfd;
    }


}




//// now create all our renID lookups:
listRenIDLookups.forEach(applyRenIDLookup);









var arrayOf = function(field, list) {
    var result = [];

    // make sure list is an array of length > 0
    if ((list) && (list.length)) {
        list.forEach(function(entry){
            if (entry[field]){
                result.push(entry[field]);
            }
        })
    }
    return result;
}





var toHash = function(field, list) {
    var result = {};

    // make sure list is an array of length > 0
    if ((list) && (list.length)) {
        list.forEach(function(entry){
            if (entry[field]){
                if (typeof result[entry[field]] == 'undefined') {
                    result[entry[field]] = [];
                }
                result[entry[field]].push(entry);
            }
        })
    }
    return result;
}

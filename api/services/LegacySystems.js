var path = require('path');
var AD = require('ad-utils');



module.exports= {



        /**
         *  @function _resolveOptions
         *
         *  Initialize a give set of options to proper default values.
         *
         *  In our exposed API, a set of options can have the following fields:
         * 
         *  options[pkList] an [] of values used to filter the desired results
         *
         *                  The key for this list can change depending on what 
         *                  kind of API method is being used:
         *                      xxxxByGUID()    :   'guids'
         *                      xxxxByNSRenID() :   'nssrenids' 
         *
         *                  if nothing is provided for pkList, then it defaults
         *                  to null.
         *
         *  populate:[]     is an array of additional information from the root 
         *                  data type(s), that should also be included in the 
         *                  output.
         *
         *                  So if you are looking for HRIS people, you might 
         *                  also want to make sure to include : 
         *                      'staffAccount', 'phones', 'emails' 
         *
         *  filter:{}       is an object the defines additional filtering 
         *                  information for the data you want to pull out.
         *
         *
         *
         *  @param [object] options     : list of options
         *                  options.guids : list of ren guids
         *                  options.populate : list of related fields to 
         *                                     populate results with.
         *                      each entry can either be a:
         *                          'string' : 'email' : populate('email')
         *                          'object' : {key:'email', filter:{email_issecure:1}}
         *                  options.filter   : additional filter for who to 
         *                                     pull out
         *  @param {string} pkList      : the name of the field to use for our
         *                                lookup key list.
         *
         *  @return [array] 
         */
        _resolveOptions:function(options, pkList){

            // if nothing,  set to empty values
            options = options || {};    // default to none

            pkList = pkList || '_';     // default to '_' which should confuse everyone.

            // did they send us a csv string?
            // eg: ****ByRenID('ren_id1, ren_id2, ..., ren_idN') :=>
            if (typeof options == 'string') {
                var newOptions = { populate:[], filter:{} };
                newOptions[pkList] = options.split(',');
                options = newOptions;
            }

            // if no pkList values given, then default to null
            if (typeof options[pkList] == 'undefined') options[pkList] = null;
            

            // make sure populate is valid.
            options.populate = options.populate || [];

            // make sure there is a filter value:
            options.filter = options.filter || {};


            return options;
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



var arrayOfUnique = function(field, list) {
    var result = {};
    list.forEach(function(entry){
        if (entry[field]){
            result[entry[field]] = 1;
        }
    })
    var uniqueResults = [];
    for (var r in result) uniqueResults.push(r);
    return uniqueResults;
}








var toHash = function(field, list) {
    var result = {};
    if (list) {
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

var toHashUnique = function(field, list) {
    var result = {};
    if (list) {
        list.forEach(function(entry){
            if (entry[field]){
                result[entry[field]] = entry;
            }
        })
    }
    return result;
}

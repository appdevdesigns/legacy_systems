var path = require('path');
var AD = require('ad-utils');


var Log = null;
var LogKey = '<green><bold>NSStaffProcessor:</bold></green>';

module.exports= {


        staffForAccount:function( Accounts ) {
            var dfd = AD.sal.Deferred();


            if (Log == null) Log = MPDReportGen.Log;

            if (typeof Accounts == 'string') {
                Accounts = Accounts.split(',');
            }
            
Log('Accounts:', Accounts);
            // Lookup All Accounts
            HRISAccount.find({account_number:Accounts })
            .fail(function(err){
console.log('Error looking up HRISAccounts:');
console.log(err); 
                dfd.reject(err);
            })
            .then(function(allAccounts){

                if (allAccounts.length == 0) {
                    dfd.resolve([]);
                } else {


Log('allAccounts:', allAccounts);
                    var accountLookup = {};
                    var familyIDs = [];
                    allAccounts.forEach(function(account){
                        familyIDs.push(account.family_id);
                        accountLookup[account.family_id] = account;
                    });

                    HRISRen.find({family_id:familyIDs, ren_isfamilypoc:1 })
                    .fail(function(err){
    console.log('Error looking up Ren by familyIDs:');
    console.log(err);  
                        dfd.reject(err);
                    })
                    .then(function(hrisRenList){

                        // for each ren attach an 'account' field:
                        hrisRenList.forEach(function(ren){
                            ren.account = accountLookup[ren.family_id];
                        });

                        dfd.resolve(hrisRenList);

                    });

                }

            });

            return dfd;
        },








        /**
         *  @function staffForNSCByGUID
         *
         *  Return an array of HRIS Ren + NSSRen info for the people who have an NSC 
         *  whose GUID matches one of the given GUIDs.
         *
         *  If no GUIDs are provided, then ALL current NSSRen matches will be returned.
         *
         *  Each data packet should contain the following information:
         *      {
         *          HRISRen Info
         *          LegacyStewardwise:{LNSSCoreRen packt}
         *      }
         *
         *  @param [object] options     : list of options
         *                  options.guids : list of ren guids who are assigend as NSC
         *                  options.populate : list of related fields to populate results with.
         *                      each entry can either be a:
         *                          'string' : 'email' : populate('email')
         *                          'object' : {key:'email', filter:{email_issecure:1}}
         *                  options.filter   : additional filter for who to pull out
         *
         *  @return [array] 
         */
        staffForNSCByGUID:function( options ) {
            var dfd = AD.sal.Deferred();
            var self = this;

//// TODO: figure out options.filter  application.
////        -> do we keep it simple and only apply it to one Model.find()?  Which one?
////        -> do we expand it, and allow: { hrisren.ren_isfamilypoc:1, nssren.nssren_isActive:1 }
////            --> [modelkey].[fieldkey] : {filterValue}
////            then each time we Model.find() apply the appropriate set of filters?


            //// 
            //// do some error checking on our given options:
            ////
            options = LegacySystems._resolveOptions(options, 'guids');


            if (Log == null) Log = MPDReportGen.Log;

            var finalResponse = [];


            var listNSCs = null;    // the list of NSCs matching the provided guids:[].  
                                    // if no guids provided, this should remain null.

            var listTerritoryIDs = null;  // the list of Territories any requested NSCs
                                    // are in.  if no guids provided, this should remain null.

            var listNSCRen = null;  // all the NSSRen entries that match the territories of
                                    // the NSCs we are requesting


            async.series([

                // step 1: look up our NSC matches
                function(next) {

                    // don't bother with this step if we weren't given any guids:
                    if ( typeof options.guids == 'undefined') {

                        next();

                    } else {


                        var filter = {}; // options.filter;
                        if (options.guids) {
                            if (filter.ren_guid) {
                                AD.log('<yellow><bold>warn:</bold></yellow> possible ren_guid conflict in call to staffForNSCByGUID(), options:', options);
                                AD.log('... options.guids takes precedence');
                            }
                            filter.ren_guid = options.guids;
                        }

                        LNSSCoreNSC.find(filter)
                        .fail(function(err){

                            AD.log.error('... error looking up NSSCoreRen: ', err);
                            next(err);

                        })
                        .done(function(list) {

                            // it is possible to request using guids:['xxx'] and 
                            // still get no results. (list == undefined)

                            // in this case we return an [] which results in 0
                            // responses.

                            listNSCs = list || [];
                            next();
                        });

                    }

                },



                // step 2: look up the territories for this NSC
                function(next) {

                    // if no NSC GUIDs were requested:
                    // listNSCs is still null, so skip to next step
                    if (listNSCs == null) {
                        next();
                        return;
                    }

                    // if there were no NSCs returned:
                    // listNSCs will be [].length == 0
                    // so we simply set listTerritoryIDs = [] and next step.
                    if (listNSCs.length == 0) {
                        listTerritoryIDs = [];  // <-- no valid territories then.
                        next();
                        return;
                    }

                    // otherwise we now lookup their territories:
                    // lookup all nss_core_nscterritory entries
                    var nscIDs = arrayOf('nsc_id', listNSCs);
                    
                    LNSSCoreNSCTerritory.find({ nsc_id:nscIDs})
                    .fail(function(err){
                        AD.log.error('... error looking up NSS CORE NSCTerritory:', err); 
                        next(err);
                    })
                    .done(function(nscTerritories){

                        // lookup all nss_core_ren with same territoryID

                        // 1) compile all the territory id's:
                        listTerritoryIDs = [];

                        if (nscTerritories) {
                            listTerritoryIDs = arrayOf('territory_id', nscTerritories);
                        }


                        next();

                    });


                },


                // step 3: now lookup all NSSRen with these territories
                function(next) {

                    // if listTerritoryIDs is an empty []
                    // this means guids were provided, but no matching entries
                    // were found.
                    // we should just skip on with listNSCRen == []
                    if ((listTerritoryIDs) && (listTerritoryIDs.length == 0)) {
                        listNSCRen = [];
                        next();
                        return;
                    }


                    // if territoryIDs is null, then no guids were used to search by, so 
                    // now simply find all NSSRen:

                    var filter = options.filter || {};
// AD.log('... listTerritoryIDs:', listTerritoryIDs);
                    if( listTerritoryIDs ) {
                        filter.territory_id = listTerritoryIDs;
                    }

                    if (typeof filter.nssren_isActive == 'undefined')  filter.nssren_isActive = { '!': 0 };

// AD.log('... filter:', filter);

                    LNSSRen.find(filter)
                    .fail(function(err){
                        next(err);
                    })
                    .done(function(list){

                        listNSCRen = list;
                        next();

                    })

                },


                // step 4: now merge this all with their HRIS info:
                function(next) {

                    // if we found no matching listNSCRen, then set our final
                    // response to [] and continue.
                    if ((listNSCRen) && (listNSCRen.length == 0)) {
                        finalResponse = [];
                        next();
                        return;
                    }


                    // otherwise we have some listNSCRen to pull out of 
                    // LegacyHRIS


                    var nssGUIDs = arrayOfUnique('ren_guid', listNSCRen);
                    LegacyHRIS.peopleByGUID({guids:nssGUIDs, populate:['staffAccounts']})
                    .fail(function(err){
                        AD.log.error('... error looking up HRIS.peopleByGUID() : ', err);
                        next(err);
                    })
                    .then(function(list){

                        //// now insert the NSS data into the HRIS data as
                        //// .LegacyStewardwise
                        var nssHash = toHashUnique('ren_guid', listNSCRen);

                        list.forEach(function(entry){

                            entry.LegacyStewardwise = nssHash[entry.ren_guid];
                        })

                        finalResponse = list;

                        next();

                    })
                    
                }

            ],function(err, results) {

                if (err) {
                    dfd.reject(err);
                } else {
                    dfd.resolve(finalResponse);
                }
            })


            return dfd;
        },




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
        // _resolveOptions:function(options, pkList){

        //     // if nothing,  set to empty values
        //     options = options || {};    // default to none

        //     pkList = pkList || '_';     // default to '_' which should confuse everyone.

        //     // did they send us a csv string?
        //     // eg: ****ByRenID('ren_id1, ren_id2, ..., ren_idN') :=>
        //     if (typeof options == 'string') {
        //         var newOptions = { populate:[], filter:{} };
        //         newOptions[pkList] = options.split(',');
        //         options = newOptions;
        //     }

        //     // if no pkList values given, then default to null
        //     if (typeof options[pkList] == 'undefined') options[pkList] = null;
            

        //     // make sure populate is valid.
        //     options.populate = options.populate || [];

        //     // make sure there is a filter value:
        //     options.filter = options.filter || {};


        //     return options;
        // },




        /**
         *  @function accountAnalysisByGUID
         *
         *  Return an array of HRIS Ren + NSS Account analysis info for the people who have one of the given GUIDs.
         *
         *  Each data packet should contain the following information:
         *      {
         *          guid            : The unique global id of this staff,
         *          accountNum      : This staff's account number,
         *          name            : The staff's name =>  "surname, givenname (preferredName)",
         *          baseSalary      : The staff's base monthly salary,
         *          chineseName     : The staff's chinese name
         *          accountBal      : The staff's current account balance 
         *          avgPayroll      : The average of staff's last 12 payroll salaries paid
         *          avgAccountBal   : The average of staff's last 12 account balances
         *          monthsInDeficit : The # months in last 12 months that account balance < 0
         *          avgLocalContrib : The net average change in account (+ or -) from local sources
         *          localPercent    : The % that avgLocalContrib makes up of avg expenditure
         *          avgForeignContrib : The net average change in account (+ or -) from foreign sources
         *          foreignPercent  : The % that avgForeignContrib makes up of avg expenditure
         *          monthsTilDeficit: estimate of how many more months until an account goes negative                       
         *          phone           : The staff's current phone (mobile)
         *          email           : The staff's current secure email address
         *          hris_region     : The staff's region info
         *          avgExpenditure  : The average amount leaving their account over the past 12 months, 
         *      }
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
        accountAnalysisByGUID:function(options) {
            var self = this;
            var dfd = AD.sal.Deferred();

            //// 
            //// do some error checking on our given options:
            ////
            options = LegacySystems._resolveOptions(options, 'guids');


            //// 
            //// some working data for this process:
            ////
            var fiscalDateInfo = null;      // required for payrollInfo(), 
            var periodDateInfo = null;      // required for foreignContributions(), localContributions(), StaffExpenditures()


            //// Primary Data Sources
            var swRenInfo = null;           // NSS info for these people: [ {nssren}, ... ]
            var swRenHash = null;           // NSS info as a hash: { ren_guid : {nssren} }
            var hrisRenHash = null;         // associated HRIS info for these people  { ren_guid : {hrisren} } 
            var territoryHash = null;       // list of { ren_guid:{territory}} 
            

            var accountBalInfo = null;
            var foreignContribInfo = null;
            var localContribInfo = null;
            


            //// Secondary Data Sources  (depends on info from Primary's )
            var listNSRenIDs = null;        // an [ nssren_id, nssren_id, ... ] gathered from swRenInfo
            var listHRISFamilyIDs = null;   // an [ family_id, family_id, ... ] gathered from hrisRen data
            var listHRISRenIDs = null;      // an [ ren_id, ren_id, ... ] gathered from hrisRen data
            var staffAccountHash = null;    // the primary Staff Accounts for these people { ren_guid: {hrisaccount}}  
            var payrollTransactionsHash = null;         // all the payroll transactions for these people { ren_guid: [{payrollTransaction}]}



            //// Data Sources based upon Staff Account:
            var accountHistoryHash = null;        // all account history entries: { ren_guid: [ {accountHistory}, {accountHistory}]}
            var localContributionsHash = null;    // all gl contribution records: { ren_guid: [ {gltrans}, {gltrans},... ]}
            var foreignContributionsHash = null;  // all gl foreign contribution records: { ren_guid: [ {gltrans}, {gltrans},... ]}
            var staffExpendituresHash = null;     // all gl debit records: { ren_guid: [{gltrans}, {gltrans}...]}


            var finalData = [];             // the array of compiled analysis info.


            async.series([

                // step 1:  pull the fiscalDate and PeriodDate for 12 months ago:
                function(next) {

                    LegacyStewardwise.fiscalPeriod()
                    .fail(function(err){
                        next(err);
                    })
                    .then(function(twelveMonthsAgo){
                        fiscalDateInfo = twelveMonthsAgo.date;      
                        periodDateInfo = twelveMonthsAgo.period;
// AD.log('... pulled fiscalDate['+fiscalDateInfo+'] and periodDate['+periodDateInfo+']');
                        next();
                    })
                }, 



                // step 2: pull all the related Primary Data Sources (like LNSSRen, LHRISRen, etc... )
                function(next) {

                    async.parallel({

                        swRenInfo:function(cb){ 
                                LegacyStewardwise.peopleByGUID({ guids:options.guids })
                                .fail(function(err){ cb(err); })
                                .done(function(listNSS) {
                                    cb(null, listNSS);
                                });
                            },

                        hrisRenInfo:function(cb){
                                LegacyHRIS.peopleByGUID({guids: options.guids, populate:[ 'phones', 'emails'] })
                                .fail(function(err){ cb(err); })
                                .done(function(listHRISRen){
                                    cb(null, listHRISRen);
                                });
                            },

                        territories:function(cb){
                                LNSSCoreTerritory.find()
                                .fail(function(err){ cb(err); })
                                .done(function(list){
                                    cb(null, list);
                                });
                            },

                        

                    }, function(err, results) {

                        if (err) {
                            next(err);
                        } else {

                            swRenInfo = results.swRenInfo;
                            swRenHash = toHashUnique('ren_guid', results.swRenInfo);
                            listNSRenIDs = arrayOf('nssren_id', results.swRenInfo);

                            hrisRenHash = toHashUnique('ren_guid', results.hrisRenInfo);
                            listHRISFamilyIDs = arrayOf('family_id', results.hrisRenInfo);
                            listHRISRenIDs = arrayOf('ren_id', results.hrisRenInfo);

                            var mapTID = toHashUnique('territory_id', results.territories);
                            territoryHash = {};
                            results.swRenInfo.forEach(function(nssren){
                                territoryHash[nssren.ren_guid] = mapTID[nssren.territory_id];
                            })

                            next();

                        }
                    })

                },



                // step 3: Pull out all secondary Data:
                function(next) {

                    // these 
                    var mapFamIDToGUID = {};
                    for (var guid in hrisRenHash) {
                        var entry = hrisRenHash[guid];
                        var famID = entry.family_id;
                        mapFamIDToGUID[famID] = guid;
                    }

                    var mapNSRenIDToGUID = {};
                    for (var guid in swRenHash) {
                        var entry = swRenHash[guid];
                        var nssrenID = entry.nssren_id;
                        mapNSRenIDToGUID[nssrenID] = guid;
                    }


                    async.parallel({

                        staffAccountInfo: function(cb) {
                            //LegacyHRIS.staffAccountsByFamID({familyids: listHRISFamilyIDs, filter:{ account_isprimary: 1 } })
                            LegacyHRIS.staffAccountsByRenID({renids: listHRISRenIDs, filter:{} })
                                .fail(function(err){ cb(err); })
                                .done(function(listAccounts){

                                    // attach ren_guid to each entry
                                    listAccounts.forEach(function(entry) {
                                        entry.ren_guid = mapFamIDToGUID[entry.family_id];
                                    })
                                    cb(null, listAccounts);
                                });
                            },

                        payrollTransactions: function(cb) {
                            var filter = {
                                glbatch_id:{ '!':0 },
                                nsstransaction_date:{ '>': fiscalDateInfo }
                            }

                            LegacyStewardwise.payrollTransactionsByNSRenID({nssrenids:listNSRenIDs, filter:filter})
                            .fail(function(err){ cb(err); })
                            .then(function(list){
                                list.forEach(function(entry){
                                    entry.ren_guid = mapNSRenIDToGUID[entry.nssren_id];
                                })
                                cb(null, list);
                            })

                        }

                    }, function (err, results) {

                        if (err){
                            next(err);
                        } else {
                        
                            staffAccountHash = toHashUnique('ren_guid', results.staffAccountInfo);
// AD.log('... staffAccountHash:', staffAccountHash);

                            payrollTransactionsHash = toHash('ren_guid', results.payrollTransactions);
// AD.log('... payrollTransactionsHash:', payrollTransactionsHash);
// AD.log('... payrollTransactions:', results.payrollTransactions);


                            next();
                        }

                    })
                },



                // step 3.1: Use staffAccounts to pull Account History, localContributions, staffExpenditures
                function(next){

                    var mapAccountToGUID = {};
                    var listAccountNums = [];

                    // create a map accountHistory
                    for (var s in staffAccountHash) {
                        var account = staffAccountHash[s];
                        var accountNum = '10'+ account.account_number;

                        mapAccountToGUID[accountNum] = account.ren_guid;

                        listAccountNums.push(accountNum);
                    }

                    async.parallel({

                        accountHistory:function(cb) {
                            LNSSCoreAccountHistory.find({ subaccounts_accountNum:listAccountNums})
                            .fail(function(err){ cb(err); })
                            .done(function(list){
                                list.forEach(function(entry){
                                    entry.ren_guid = mapAccountToGUID[entry.subaccounts_accountNum];
                                })
                                cb(null, list);
                            });

                        }, 

                        localContributions:function(cb){
// AD.log('... listAccountNums:', listAccountNums);
                            LNSSCoreGLTrans.find({or: [
                                {gltran_acctnum: 4000},
                                {gltran_acctnum: 4010}
                                ]})
                            .where({gltran_perpost: {'>': periodDateInfo}})
                            .where({gltran_subacctnum:listAccountNums})
                            .fail(function(err){ cb(err); })
                            .done(function(list){
                                list.forEach(function(entry){
                                    entry.ren_guid = mapAccountToGUID[entry.gltran_subacctnum];
                                })
// AD.log('... list GLTrans:', list);
                                cb(null, list);
                            });
                        },


                        foreignContributions:function(cb) {
                            LNSSCoreGLTrans.find({gltran_acctnum:5000})
                            .where({gltran_perpost: {'>': periodDateInfo}})
                            .where({gltran_subacctnum:listAccountNums})
                            .fail(function(err){ cb(err); })
                            .done(function(list){
                                list.forEach(function(entry){
                                    entry.ren_guid = mapAccountToGUID[entry.gltran_subacctnum];
                                })
// AD.log('... list foreign GLTrans:', list);
                                cb(null, list);
                            });

                        },


                        staffExpenditures:function(cb) {
                            LNSSCoreGLTrans.find()
                            .where({ 
                                // only debit transactions
                                gltran_dramt: { '>': 0 },
                                gltran_cramt: 0
                            })
                            .where({gltran_perpost: {'>': periodDateInfo}})
                            .where({gltran_subacctnum:listAccountNums})
                            .fail(function(err){ cb(err); })
                            .done(function(list){
                                list.forEach(function(entry){
                                    entry.ren_guid = mapAccountToGUID[entry.gltran_subacctnum];
                                })
// AD.log('... list expenditures GLTrans:', list);
                                cb(null, list);
                            });

                        }

                    }, function(err, results){


                        accountHistoryHash = toHash('ren_guid', results.accountHistory);
// AD.log('... accountHistoryHash:', accountHistoryHash);
                        localContributionsHash = toHash('ren_guid', results.localContributions);
// AD.log('... localContributionsHash:', localContributionsHash);
                        foreignContributionsHash = toHash('ren_guid', results.foreignContributions);
// AD.log('... foreignContributionsHash:', foreignContributionsHash);
                        staffExpendituresHash = toHash('ren_guid', results.staffExpenditures);
// AD.log('... staffExpendituresHash:', staffExpendituresHash);

                        next();
                    });
                    


                },



                // step 4: compile data together:
                function(next) {


                    swRenInfo.forEach(function(nssRen){

                        var guid = nssRen.ren_guid;
                        var hrisRen = hrisRenHash[guid];
                        if (typeof hrisRen != 'undefined') {

                            var clone = {};

                            

                            clone.guid = guid;
                            clone.accountNum = Helper.getAccountNumber(staffAccountHash[guid]);

                            clone.name = Helper.getName(hrisRenHash[guid]);
                            clone.chineseName = hrisRen.ren_namecharacters || '??';
                            clone.phone = Helper.getPhone(hrisRenHash[guid]);
                            clone.email = Helper.getEmail(hrisRenHash[guid]);

                            clone.baseSalary = nssRen.nssren_salaryAmount;
                            clone.accountBal = nssRen.nssren_ytdBalance.toFixed(0);
                            clone.avgPayroll = Helper.averageTotalSalary(payrollTransactionsHash[guid]);


                            clone.avgAccountBal = Helper.averageAccountBalance(accountHistoryHash[guid], nssRen.nssren_balancePeriod);

                            clone.monthsInDeficit = Helper.monthsInDeficit(accountHistoryHash[guid], nssRen.nssren_balancePeriod);

                            clone.avgExpenditure = Helper.averageStaffExpenditures( staffExpendituresHash[guid]);

                            clone.avgLocalContrib = Helper.averageContributions( localContributionsHash[guid] );
                            clone.localPercent = Helper.getPercent(clone.avgLocalContrib, clone.avgExpenditure);

                            clone.avgForeignContrib = Helper.averageContributions( foreignContributionsHash[guid] );
                            clone.foreignPercent = Helper.getPercent(clone.avgForeignContrib, clone.avgExpenditure);





                            clone.monthsTilDeficit = Helper.getMonthsTilDeficit( {
                                avgContributions: clone.avgLocalContrib + clone.avgForeignContrib,
                                avgExpenditures: clone.avgExpenditure,
                                accountBalance: clone.accountBal
                            });

                            clone.hris_region = Helper.regionFromTerritory( territoryHash[guid] );


                            //// make numbers pretty:
                            clone.avgPayroll = Helper.formatNumber(clone.avgPayroll);
                            clone.avgAccountBal = Helper.formatNumber(clone.avgAccountBal);

                            clone.baseSalary = Helper.formatNumber(clone.baseSalary);
                            clone.accountBal = Helper.formatNumber(clone.accountBal);
                            clone.avgLocalContrib = Helper.formatNumber(clone.avgLocalContrib);
                            clone.avgForeignContrib = Helper.formatNumber(clone.avgForeignContrib);


                            finalData.push(clone);
                        } else {
                            AD.log('<yellow><bold>warn:</bold></yellow> NSSRen ['+guid+'] did not have a match in HRIS!');
                        }
                    })

                    next();
                }

            ], function(err, results) {

                if (err) {
                    dfd.reject(err);
                } else {
// AD.log('... finalData:',finalData);

                    dfd.resolve(finalData);
                }

            })

            return dfd;
        },



        peopleByGUID:function(options) {
            var dfd = AD.sal.Deferred();


            //// 
            //// do some error checking on our given options:
            ////
            options = LegacySystems._resolveOptions(options, 'guids');


            var filter = options.filter;
            if (options.guids) {
                if (filter.ren_guid) {
                    AD.log('<yellow><bold>warn:</bold></yellow> possible ren_guid conflict in call to peopleByGUID(), options:', options);
                    AD.log('... options.guids takes precedence');
                }
                filter.ren_guid = options.guids;
            }

            filter.nssren_isActive = 1;
// AD.log('... filter:', filter);

            LNSSRen.find(filter).sort('nssren_ytdBalance asc')
            .fail(function(err){

                Log.error(LogKey+' failed to lookup LNSSRen(nssren_isActive:1):', err);
                dfd.reject(err);
            })
            .then(function(rens){
                
                dfd.resolve(rens);
            });
            return dfd;


        },





        //--------------------------------------------------------------------
        //  Payroll Transactions  Lookups
        //--------------------------------------------------------------------
        /**
         *  @function payrollTransactionsByNSRenID
         *
         *  Return an array of NSS Payroll Transactions, associated with the 
         *  provided ren_id.
         *
         *  @param [object] options     : list of options
         *                  options.nssrenids : list of (nss).ren_id values
         *                  options.populate : list of related fields to populate results with.
         *                      each entry can either be a:
         *                          'string' : 'email' : populate('email')
         *                          'object' : {key:'email', filter:{email_issecure:1}}
         *                  options.filter   : additional filter for data to pull out
         *
         *  @return [array] 
         */
        payrollTransactionsByNSRenID:function(options){
            var dfd = AD.sal.Deferred();
            var self = this;

            //// 
            //// do some error checking on our given options:
            ////
            options = LegacySystems._resolveOptions(options, 'nssrenids');


            // prepare our filter:
            var filter = options.filter;
            if (options.nssrenids) {
                if (filter.nssren_id) {
                    AD.log('<yellow><bold>warn:</bold></yellow> possible nssren_id conflict in call to payrollTransactionsByNSRenID(), options:', options);
                    AD.log('... options.familyids takes precedence');
                }
                filter.nssren_id = options.nssrenids;
            }


            // then lookup LNSSPayrollTransactions.find( filter );
// AD.log('... LNSSPayrollTransactions.find()  filter:', filter);
            LNSSPayrollTransactions.find(filter)
            .fail(function(err){

                AD.log.error('... payrollTransactionsByNSRenID() failed LNSSPayrollTransactions lookup: filter:', filter, '\n err:', err);
                dfd.reject(err);
            })
            .done(function(list){
// AD.log('... LNSSPayrollTransactions.find() :', list);
                dfd.resolve(list);

            })

            return dfd;
        },



        /**
         *  @function payrollTransactionsByGUID
         *
         *  Return an array of NSS Payroll Transactions, associated with the 
         *  provided guid values.
         *
         *  @param [object] options     : list of options
         *                  options.guids    : list of ren_guid values
         *                  options.populate : list of related fields to populate results with.
         *                      each entry can either be a:
         *                          'string' : 'email' == populate('email')
         *                          'object' : {key:'email', filter:{email_issecure:1}}
         *                  options.filter   : additional filter for data to pull out
         *  
         *  @return [array] 
         */
        payrollTransactionsByGUID:function(options) {
            var dfd = AD.sal.Deferred();


            //// 
            //// do some error checking on our given options:
            ////
            options = LegacySystems._resolveOptions(options, 'guids');


            var filter = {};
            if (options.guids) {
                filter.ren_guid = options.guids;
            }


            // 1st we go and get the LNSSRen for each of these guids
            LNSSRen.find(filter)
            .fail(function(err){

                Log.error(LogKey+' payrollTransactionsByGUID() failed to lookup LNSSRen():', err);
                dfd.reject(err);
            })
            .then(function(rens){

                // now pull the nssren_id values and use them to fine the prayroll transactions
                var listNSRenIDs = arrayOfUnique('nssren_id', rens);
                var mapIDtoGUID = toHashUnique('nssren_id', rens);
                LegacyStewardwise.payrollTransactionsByNSRenID({nssrenids:listNSRenIDs, populate:options.populate, filter:options.filter})
                .fail(function(err){ dfd.reject(err); })
                .done(function(list){

                    // all our xxxxByGUID() methods return their results with a ren_guid in them.
                    list.forEach(function(item){
                        if (mapIDtoGUID[item.nssren_id]) {
                            item.ren_guid = mapIDtoGUID[item.nssren_id].ren_guid;
                        }
                    })

                    dfd.resolve(list);

                })
                
                
            });
            return dfd;

        },




        //Get the fiscal period from 12 months ago
        fiscalPeriod: function(){
            /*
            Look up the fiscal period & fiscal year tables. Find the latest
            twelve closed periods, and take the earliest of them.

            If we were to do it purely in SQL:

            SELECT * FROM (
                SELECT
                    requestcutoff_date AS 'date',
                    CONCAT(fiscalyear_glprefix, LPAD(requestcutoff_period, 2, '0')) AS 'period'
                FROM
                    nss_core_fiscalperiod p
                    JOIN nss_core_fiscalyear y
                        ON p.requestcutoff_year = y.fiscalyear_id
                WHERE
                    requestcutoff_isClosed = 1
                ORDER BY
                    requestcutoff_id DESC
                LIMIT 12
            ) AS latest ORDER BY period ASC LIMIT 1;
            */


            var dfd = AD.sal.Deferred();

            LNSSCoreFiscalPeriod
            .find({requestcutoff_isClosed: 1})
            .sort("requestcutoff_id desc")
            .limit(12)
            .fail(function(err) {
                dfd.reject(err);
            })
            .done(function(period){

                //Retrieve the requestcutoff_date from 12 months ago and load into the Date() function
                var fiscalPeriod = new Date(period[11].requestcutoff_date);

                //Extract the year, month and day
                var year = fiscalPeriod.getFullYear();
                var month = fiscalPeriod.getMonth() + 1;
                var day = fiscalPeriod.getDate() + 1;

                //Format the endDate
                var realDate = year + "-" + month + "-" + day;
                
                // Query the fiscal year table
                LNSSCoreFiscalYear.find({fiscalyear_id: period[11].requestcutoff_year})
                .fail(function(err){
                    dfd.reject(err);
                })
                .done(function(fiscalYear){
// AD.log('... fiscalYear:',fiscalYear);                    
                    var glYear = fiscalYear[0].fiscalyear_glprefix;
                    var glPeriod = period[11].requestcutoff_period;
                    var glDate;
                    if (glPeriod < 10) {
                        glDate = glYear + '0' + glPeriod;
                    } else {
                        glDate = glYear + '' + glPeriod;
                    }
                    
                    dfd.resolve({
                        date: realDate,
                        period: glDate
                    });

                });

            });

            return dfd;
        },





        regionsFromTerritories: function(filter) {
            var dfd = AD.sal.Deferred();


            LNSSCoreTerritory.find(filter)
            .fail(function(err){
                AD.log.error('... error finding territories with filter: ', filter, '\n err:', err);
                dfd.reject(err);
            })
            .done(function(list){

                list.forEach(function(entry){
                    entry.region = Helper.regionFromTerritory(entry);
                })

                dfd.resolve(list);
            })

            return dfd;
        }


}




var Helper = {


    buildBalanceArray:function(balances, period) {

        var balancesArray = [];

        var balanceHash = toHashUnique('accounthistory_fiscalyear', balances);
// AD.log('... balanceHash:',balanceHash);

        var thisYear = period.split("-")[0];
        var thisYearRow = balanceHash[thisYear];
        var lastYearRow = balanceHash[thisYear - 1];

        var buildArray = function(row) {

            for (var r in row) {
                // if it is one of the ytdbalXX columns
                if (r.indexOf("accounthistory_ytdbal") != -1) {

                    // but NOT ytdbal00
                    if (r.indexOf("accounthistory_ytdbal00") == -1) {


                        balancesArray.push(row[r]);
                    }

                }
            }
        }

        // if there is a previous year here:
        if (lastYearRow) {
            buildArray(lastYearRow);
        }
        buildArray(thisYearRow);


        return balancesArray;

    },


    averageAccountBalance:function( balances, period){
        //Calculate the avgAccountBal using the accountBal rows based off of staff account num
        //and the current account bal period from nss_core_ren table

        var avgAccountBal = 0;
        var totalAccountBalance = 0;
        var totalMonths = 12;
        var start = 0;
        var stop = 0;

        //the field nss_core_ren.nssren_balancePeriod is blank
        if (period == ""){
            return "0";
        }

        //Take the rows and build an array of account balance values
        var balancesArray = Helper.buildBalanceArray(balances, period);  //[];
        

// AD.log('... balancesArray:', balancesArray);


        var year = period.split("-")[0];
        var month = period.split("-")[1];

        if (balancesArray.length == 12){
            start = 0;
            stop = month;
        }else{
            stop = parseInt(totalMonths) + parseInt(month);
            start = stop - totalMonths;
        }

        while (stop > start){
            totalAccountBalance = totalAccountBalance + balancesArray[start];
            start++;
        }

        avgAccountBal = (totalAccountBalance / totalMonths).toFixed(0);

        return avgAccountBal;
    },




    averageContributions: function( transactions ) {
        //Calculate the avgContributions using the rows from nss_core_gltran
        //from the last 12 months

        var avgContributions = 0;
        var totalContributions = 0;
        var totalMonths = 12;

        //No local contributios for the ren
        if (!transactions){
            return "0";
        }

        //Loop through the nss_core_gltran rows adding and subtracting
        transactions.forEach(function(entry){
            if (entry.gltran_cramt > 0){
                totalContributions = totalContributions + entry.gltran_cramt;
            }else{
                totalContributions = totalContributions - entry.gltran_dramt;
            }
        })

        avgContributions = (totalContributions / totalMonths).toFixed(0);

        return avgContributions;
    },



    averageStaffExpenditures:function(transactions) {

        if (transactions) {

            var total = 0;
            transactions.forEach(function(entry){
                total += entry.gltran_dramt;
            })

            return Math.round( total / 12);

        } else {

            return 0;
        }
    },




    averageTotalSalary: function(payrollTransactions, totalMonths) {
        //Calculate the avgPayroll based off the payroll rows for the renId


        totalMonths = totalMonths || 12;


        var totalSalarySum = 0;

        //no payroll transactions provided:
        if (!payrollTransactions){
            return "0";
        }

        //total the totalSalary field
        payrollTransactions.forEach(function(transaction){
            totalSalarySum += transaction.nsstransaction_totalSalary;
        })


        //divide the totalSalary by the amount of months added together and round to 2 decimal places
        var avgSalary = (totalSalarySum / totalMonths).toFixed(0);

        return avgSalary;

    },


    getMonthsTilDeficit:function(options) {
        var monthsTilDeficit = 1;
// AD.log('... options:',options);

            //the account is currently in deficit
            if (options.accountBalance < 0){
                return "1";
            }

// AD.log('... calculating trend:');

            // Ed Graham's formula
            var accountTrend = options.avgContributions - options.avgExpenditures;
// AD.log('... accountTrend:',accountTrend);

            if (accountTrend >= 0) {
                monthsTilDeficit = 'NA';
            } else {
                monthsTilDeficit = Math.ceil(options.accountBalance / (accountTrend * -1));
                if (monthsTilDeficit >= 13) {
                    monthsTilDeficit = 'NA';
                }
            }
// AD.log('... monthsTilDeficit:',monthsTilDeficit);            
            /*
            //the account will never be in deficit since avgContributions > payroll or they are equal
            if (avgContributions > payroll || avgContributions == avgPayroll) {
                monthsTilDeficit = "NA";
            } else {
                //Continue to add avgContributions and subtract payroll to accountBalance
                //until accountBalance is in deficit (negative)
                while (accountBalance > 0) {
                    accountBalance = accountBalance + avgContributions - payroll;
                    monthsTilDeficit++;
                }
            }
            */
            return monthsTilDeficit;

    },



    //Calculate the contributions percentage using the contributions and the salary
    getPercent: function(value, base){
        var percentage = 0;

        //Calculation won't work if base is zero
        if (base === 0){
            return "0%";
        }

        percentage = (value / base) * 100;

        return percentage.toFixed(0) + "%";
    },






    monthsInDeficit:function( balances, period){
        //Calculate monthsInDeficit using the accountBal rows based off of staff account num
        //and the current account bal period from nss_core_ren table

        var monthsInDeficit = 0;
        var stop = 0;
        var start = 0;

        //the field nss_core_ren.nssren_balancePeriod is blank
        if (period == ""){
            return "0";
        }

        var month = period.split("-")[1];

        //Take the rows and build an array of account balance values
        var balancesArray = Helper.buildBalanceArray(balances, period);  //[];


        if (balancesArray.length == 12){
            start = 0;
            stop = month;
        }else{
            stop = 12 + parseInt(month);
            start = stop - 12;
        }

        while (stop > start){
            if(balancesArray[start] < 0){
                monthsInDeficit++;
            }
            start++;
        }

        return monthsInDeficit;
    },



    formatNumber:function(number){

        // if number is valid
        if (number) {
            while (/(\d+)(\d{3})/.test(number.toString())){
                number = number.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
            }
        }

        return number;
    },



    getAccountNumber: function(entry) {
        if (entry) {
            return entry.account_number || '??';
        } else {
            return '??';
        }
    },

    getName:function(entry) {
        var name = '??';

        if (entry) {
            name = entry.ren_surname + ", " + entry.ren_givenname;
            if (entry.ren_preferredname) {
                name += " (" + entry.ren_preferredname + ")";
            } 
        } 

        return name;
    },

    getPhone: function(entry){

        // add on mobile phone:
        var ren_mobilephone = '??';
        var pKey = entry._phones ? '_phones' : 'phones';
        if (entry[pKey].length > 0) {
            entry[pKey].forEach(function(phone) {
                if (phone.phonetype_id == 3) {
                    ren_mobilephone = phone.phone_number;
                }
            })
        }

        return ren_mobilephone;
    }, 


    getEmail: function (entry) {

        // add on secure email
        var secureEmail = '??';
        var eKey = entry._emails ? '_emails' : 'emails';
        if (entry[eKey].length > 0) {
            entry[eKey].forEach(function(email){
                if (email.email_issecure == 1) {
                    secureEmail = email.email_address;
                }
            })
        }

        return secureEmail;
    },



    regionFromTerritory: function(entry) {
        if (entry) {
            return entry.territory_desc.split('-',1);
        } else {
            return '??';
        }
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

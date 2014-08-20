/**
 * This file describes the data we are generating/importing during our test
 * data routines.
 *
 * Each entry represents a step in the process.  
 *
 * Steps are defined by a task task name.  This represents a task defined in either our
 * generateor.js or importor.js files.  
 *
 * As this whole process is run, we collect data in a common data store.  Each step can read from
 * or write data to this store.  
 *
 * Steps are designed to be small tasks that work upon data in the data store.  They generate data 
 * and store it in the datastore.  They modify and update data in the datastore.  The read data
 * out of the data store and perform an action.
 *
 * Some commom parameters among all our steps:
 *      model:      [string] the name of the Model Object to use for this task
 *      dataRef:  [string] a unique key for the data access data in the datastore
 *      file:       [string] the name of the data file that contains the data
 *      task:  [string] the name of the task fn to use
 *      log:        [string] a string to output on the console for this step. These strings may contain
 *                           embedded values like [count] that can be replaced with info about the data
 *                           being worked on by the task. 
 *
 * Some common tasks for generating data:
 *      readModel   Read data from a specified model: object. The data is stored in the datastore[dataRef]
 *      saveData    Write data in datastore[dataRef] to a specified  outputFile:
 *      importData  Read data from a importFile: and store it in datastore[dataRef]
 *      createArrayOfFieldValues    take an array of objects in datastore[dataRef] and create an array of 
 *                  datastore[dataRef][field] values to store back in datastore[destDataRef]
 *
 *
 * When running the importor.js routine, we primarily look for the saveData task.  If that task defines both
 * a model: and outputFile:  then the importer will work backwards from there to import that data using the 
 * model: provided.
 *
 */
var path = require('path');

var KEY_FAMILY_DATA = 'familyData';
var KEY_PERSON_DATA = 'peopleData';
module.exports = [

    ////
    //// Verify We actually want to run the Generate Test Routine:
    ////
    {
        task:'verifyGenerateTestData',
        moduleConfig:'legacy_systems.js'
    },


    ////
    //// Verify any referenced models are configured properly:
    ////
    {
        task:'verifyModelsAreConfigured',
        moduleConfig:'legacy_systems.js'
    },


    ////
    //// Verify files will be overwritten:
    ////
    {
        task:'verifyFilesAreOverwritten',
        moduleConfig:'legacy_systems.js',
        pathToFiles:path.join('setup', 'test_data') + path.sep
    },


    ////
    //// Verify we need some test data:
    ////
    {
        task:'verifyWeNeedSomeTestData',
        moduleConfig:'legacy_systems.js',
        additionalFiles:[
            'data_email.js',
            'data_names_female.js',
            'data_names_male.js',
            'data_phone.js'
        ],
        pathToFiles:path.join(__dirname, 'generate_test_data') 
    },


    // 
    // store the Default Destination Directory
    // 
    // this is used by saveData tasks if no destinationDirectory: is provided.
    {
        task:'storeValue',
        dataRef:'default.saveData.destinationDirectory', 
        value:path.join(__dirname, 'test_data')
    },


    // 
    // store the Default import Directory
    // 
    // this is used by importData tasks if no importDirectory: is provided.
    {
        task:'storeValue',
        dataRef:'default.importData.importDirectory', 
        value:path.join(__dirname, 'generate_test_data')
    },



    //
    // Process All the Family entries:
    //
    { 
        task:'pullFamilyData',
        model:'LHRISFamily',      
        dataRef:KEY_FAMILY_DATA,         
        // file:'data_hris_family.js'           
    },
    { task:'saveData', dataRef:KEY_FAMILY_DATA,   model:'LHRISFamily', outputFile:'data_hris_family.js', log:'... generating <yellow>[count] families</yellow> ' },
    //// Convert our family list into a listFamilyIDs
    { 
        task:'createArrayOfFieldValues',
        dataRef:KEY_FAMILY_DATA,
        destDataRef:'listFamilyIDs',
        field:'family_id'
    },



    //
    // Process All the People entries:
    //
    { 
        task:'pullPersonData',
        model:'LHRISRen',      
        dataRef:KEY_PERSON_DATA,         
        // file:'data_hris_ren.js',           
        
        // REQUIRED for pullPersonData()
        keyFamily:KEY_FAMILY_DATA       
    },
    //// Convert our person list into a renIDList
    { 
        task:'createArrayOfFieldValues',
        dataRef:KEY_PERSON_DATA,
        destDataRef:'listRenIDs',
        field:'ren_id'
    },
    


    //
    // Process All the Email entries:
    //
    { 
        task:'readModel',
        model:'LHRISEmail',
        dataRef:'emailData',
        fieldIn:{ 'ren_id': 'listRenIDs'}
    },
    { task:'importData', dataRef:'randomEmailData', importFile:'data_email.js' },
    {
        task:'replaceAwithB',
        dataRef:'emailData',
        bRef:'randomEmailData',
        fields:['email_address'],
        methodEmpty:'roundrobin'
    },
    { task:'saveData', dataRef:'emailData',  model:'LHRISEmail', outputFile:'data_hris_email.js', log:'... generating <yellow>[count] eMails</yellow> ' },
    


    //
    // Process All the Phone entries:
    //
    { 
        task:'readModel',
        model:'LHRISPhone',
        dataRef:'phoneData',
        fieldIn:{ 'ren_id': 'listRenIDs'}
    },
    { task:'importData', dataRef:'randomPhoneData', importFile:'data_phone.js'    },
    {
        task:'replaceAwithB',
        dataRef:'phoneData',
        bRef:'randomPhoneData',
        fields:['phone_number'],
        methodEmpty:'reuse'
    },
    { task:'saveData', dataRef:'phoneData',  model:'LHRISPhone', outputFile:'data_hris_phone.js', log:'... generating <yellow>[count] phones</yellow> ' },
    



    //// Process All the Account entries:
    { 
        task:'readModel',
        model:'LHRISAccount',
        dataRef:'accountData',
        fieldIn:{ 'family_id': 'listFamilyIDs' }
    },
    { task:'saveData',     model:'LHRISAccount',     dataRef:'accountData',  outputFile:'data_hris_account.js',  log:'... generating <yellow>[count] accounts</yellow> '    },



    //// LHRISAssignLocationType
    { task:'readModel',    model:'LHRISAssignLocationType',     dataRef:'assignmentLocationType'                                           },
    { task:'saveData',     model:'LHRISAssignLocationType',     dataRef:'assignmentLocationType',  outputFile:'data_hris_assign_location_type.js',  log:'... generating <yellow>[count] assignment location types</yellow> '    },


    //// LHRISAssignLocationTypeTrans
    { task:'readModel',    model:'LHRISAssignLocationTypeTrans',     dataRef:'assignmentLocationTypeTrans'                                           },
    { task:'saveData',     model:'LHRISAssignLocationTypeTrans',     dataRef:'assignmentLocationTypeTrans',  outputFile:'data_hris_assign_location_type_trans.js'    },


    //// LHRISCountry
    { task:'readModel',    model:'LHRISCountry',     dataRef:'countryData'                                           },
    { task:'saveData',     model:'LHRISCountry',     dataRef:'countryData',  outputFile:'data_hris_country.js', log:'... generating <yellow>[count] countries</yellow> '    },


    //// LHRISCountryTrans
    { task:'readModel',    model:'LHRISCountryTrans',     dataRef:'countryDataTrans'                                           },
    { task:'saveData',     model:'LHRISCountryTrans',     dataRef:'countryDataTrans',  outputFile:'data_hris_country_trans.js'    },



    //// LHRISPhoneType
    { task:'readModel',    model:'LHRISPhoneType',     dataRef:'phoneTypeData'                                           },
    { task:'saveData',     model:'LHRISPhoneType',     dataRef:'phoneTypeData',  outputFile:'data_hris_phone_type.js', log:'... generating <yellow>[count] phone types</yellow> '    },


    //// LHRISPhoneTypeTrans
    { task:'readModel',    model:'LHRISPhoneTypeTrans',     dataRef:'phoneTypeTrans'                                           },
    { task:'saveData',     model:'LHRISPhoneTypeTrans',     dataRef:'phoneTypeTrans',  outputFile:'data_hris_phone_type_trans.js'    },



    //// I've manually crafted location data, so just import them from
    //// the given import files:
    { task:'importData', dataRef:'assignLocationData', importFile:'data_hris_assign_location.js'    },
    { task:'saveData', dataRef:'assignLocationData',   outputFile:'data_hris_assign_location.js', model:'LHRISAssignLocation', log:'... generating <yellow>[count] locations</yellow> '    },
    { task:'importData', dataRef:'assignLocationTrans', importFile:'data_hris_assign_location_trans.js'    },
    { task:'saveData', dataRef:'assignLocationTrans',   outputFile:'data_hris_assign_location_trans.js', model:'LHRISAssignLocationTrans'    },



    


    /////
    ///// Read In all Assignments related to the people we are working with
    /////
    { task:'readModel', model:'LHRISAssignment',    dataRef:'assignmentData',   fieldIn:{ 'ren_id': 'listRenIDs'}   },
    { 
        task:'createArrayOfFieldValues',
        dataRef:'assignmentData',
        destDataRef:'listTeamIDs',
        field:'team_id',
        uniqueValues:true
    },
    { task:'saveData',  model:'LHRISAssignment',    dataRef:'assignmentData',   outputFile:'data_hris_assignment.js',   log:'... generating <yellow>[count] assignments</yellow> '  },



    /////
    ///// PUll in XRefTeamLocations by the teams provided:
    /////
    { task:'readModel', model:'LHRISXRefTeamLocation',  dataRef:'xrefTeamLocationData', fieldIn:{ 'team_id': 'listTeamIDs'} },
    {
        task:'mapAtoB',
        dataRef:'xrefTeamLocationData',
        mapRef:'assignLocationData',
        field:'location_id',
        methodEmpty:'roundrobin'
    },
    { task:'saveData',  model:'LHRISXRefTeamLocation',  dataRef:'xrefTeamLocationData', outputFile:'data_hris_xref_team_location.js',   log:'... generating <yellow>[count] team <-> locations</yellow> '   },


    /////
    ///// Switch to NSS Data:
    /////


    //// LNSSCoreFiscalPeriod
    { task:'readModel',    model:'LNSSCoreFiscalPeriod',     dataRef:'nssFiscalPeriod'                                           },
    { task:'saveData',     model:'LNSSCoreFiscalPeriod',     dataRef:'nssFiscalPeriod',  outputFile:'data_nss_fiscal_period.js'    },

    //// LNSSCoreFiscalYear
    { task:'readModel',    model:'LNSSCoreFiscalYear',     dataRef:'nssFiscalYear'                                           },
    { task:'saveData',     model:'LNSSCoreFiscalYear',     dataRef:'nssFiscalYear',  outputFile:'data_nss_fiscal_year.js'    },


    //// LNSSCoreAccountHistory
    { task:'readModel',    model:'LNSSCoreAccountHistory',     dataRef:'nssAccountHistory',
        filter:{accounthistory_fiscalyear:{ '>=':2013}},
    },
    { task:'saveData',     model:'LNSSCoreAccountHistory',     dataRef:'nssAccountHistory',  outputFile:'data_nss_account_history.js', log:'... generating <yellow>[count] Account Histories</yellow> '    },



    //// LNSSCoreGLTrans
    { task:'readModel',    model:'LNSSCoreGLTrans',     dataRef:'nssCoreGLTrans',   
        filter:{gltran_fiscalyr:{ '>=':2013}},
        limit:800
    },
    { task:'replaceStrings', dataRef:'nssCoreGLTrans',
        fields:['gltran_trandesc'],
        toLower:true,
        replacements:{ 
            'church':'......',
            'nice':'....',
            'ter' :'...',
            'margr':'.......',
            'liz':'...',
            'kore':'....',
            'sale':'....',
            'jojo':'....',
            'promise':'.....',
            'williams':'........',
            'rebec':'.....',
            'timothy':'.......',
            'kim':'...',
            'john':'....',
            'grace':'.....',
            'jode':'....',
            'rebbeca':'.......',
            'albert':'......',

            'chang':'.....',
            'qiong':'.....',
            'sheng':'.....',
            'xiang':'.....',
            'xiong':'.....',
            'zhang':'.....',
            'zhong':'.....',
            'zhuai':'.....',

            'bobo':'....',
            'bing':'....',
            'chun':'....',
            'cong':'....',
            'dong':'....',
            'fang':'....',
            'feng':'....',
            'iang':'....',
            'iong':'....',
            'jiao':'....',
            'jing':'....',
            'ming':'....',
            'nian':'....',
            'ning':'....',
            'ping':'....',
            'qing':'....',
            'shan':'....',
            'shao':'....',
            'shou':'....',
            'shun':'....',
            'shuo':'....',
            'stad':'....',
            'ting':'....',
            'tian':'....',
            'tuan':'....',
            'wang':'....',
            'xian':'....',
            'xiao':'....',
            'ying':'....',
            'yong':'....',
            'zhao':'....',
            'zhen':'....',
            'zhou':'....',


            'ang':'...',
            'bai':'...',
            'bao':'...',
            'bei':'...',
            'bin':'...',
            'cao':'...',
            'chu':'...',
            'deb':'...',
            'eng':'...',
            'fei':'...',
            'gao':'...',
            'gua':'...',
            'guo':'...',
            'hai':'...',
            'han':'...',
            'hua':'...',
            'hui':'...',
            'huo':'...',
            'ian':'...',
            'ild':'...',
            'jia':'...',
            'jie':'...',
            'jim':'...',
            'jin':'...',
            'jiu':'...',
            'jue':'...',
            'jun':'...',
            'kai':'...',
            'lao':'...',
            'lin':'...',
            'liu':'...',
            'lei':'...',
            'mei':'...',
            'min':'...',
            'nie':'...',
            'ong':'...',
            'pam':'...',
            'pei':'...',
            'qiu':'...',
            'qun':'...',
            'run':'...',
            'ser':'...',
            'shi':'...',
            'sue':'...',
            'sun':'...',
            'suo':'...',
            'uai':'...',
            'uan':'...',
            'vid':'...',
            'wei':'...',
            'wen':'...',
            'woo':'...',
            'xun':'...',
            'xie':'...',
            'xia':'...',
            'yan':'...',
            'zai':'...',
            'zhi':'...',
            'zhu':'...',

            'ai':'..',
            'an':'..',
            'ao':'..',
            'bo':'..',
            'bu':'..',
            'da':'..',
            'de':'..',
            'di':'..',
            'du':'..',
            'en':'..',
            'et':'..',
            'ge':'..',
            'gu':'..',
            'he':'..',
            'ia':'..',
            'ji':'..',
            'jo':'..',
            'li':'..',
            'lu':'..',
            'ma':'..',
            'mu':'..',
            'na':'..',
            'pu':'..',
            'qi':'..',
            'ri':'..',
            'ru':'..',
            'ry':'..',
            'si':'..',
            'wu':'..',
            'ui':'..',
            'un':'..',
            'xi':'..',
            'xu':'..',
            'ya':'..',
            'yi':'..',
            'yu':'..',
            'zi':'..',


            'â':'.',
            'ã':'.',
            '¥':'.',
            '¿':'.',
            '¤':'.',
            'â':'.',
            '©':'.',
            '°':'.',
            '±':'.',
            '¼':'.',
            '¦':'.',
            'ž':'.',
            '·':'.',
            '‘':'.',
            '’':'.',
            '•':'.',
            '™':'.',
            'š':'.',
            'ƒ':'.',
            '¶':'.',
            '§':'.',
            '½':'.',
            '…':'.',
            'º':'.',
            '”':'.',
            '»':'.',
            '´':'.',
            ',':'.',


            // put this back:
            'assessm..t':'assessment',
            '..onymous':'anonymous'

        }
    },     
//// TODO: do we need to sync subaccounts with our existing account History info?                                   
    { task:'saveData',     model:'LNSSCoreGLTrans',     dataRef:'nssCoreGLTrans',  outputFile:'data_nss_gl_trans.js', log:'... generating <yellow>[count] GL Transactions</yellow> '    },




    //// LNSSCoreNSC
    { task:'readModel',    model:'LNSSCoreNSC',     dataRef:'nssNSC' },
    { task:'mixRenNewGUID', dataRef:'nssNSC',     dataRefRen:KEY_PERSON_DATA,     field:'ren_guid',  newValue:'new_ren_guid', skipValues:[null] },
    { task:'saveData',     model:'LNSSCoreNSC',     dataRef:'nssNSC',  outputFile:'data_nss_nsc.js', log:'... generating <yellow>[count] nsc</yellow> '    },



    //// LNSSCoreNSCTerritory
    { task:'readModel',    model:'LNSSCoreNSCTerritory',     dataRef:'nssNSCTerritory' },
    { task:'saveData',     model:'LNSSCoreNSCTerritory',     dataRef:'nssNSCTerritory',  outputFile:'data_nss_nsc_territory.js', log:'... generating <yellow>[count] nsc <-> territories</yellow> '    },



    //// LNSSCoreTerritory
    { task:'readModel',    model:'LNSSCoreTerritory',     dataRef:'nssTerritory' },
    { task:'splitReplaceField', dataRef:'nssTerritory',  fields:['territory_desc'],  splitOn:' ', replaceChar:'.' },
    { task:'replaceStrings',    dataRef:'nssTerritory',
        fields:['territory_desc'],
        replacements:{ 
            'Kyrgyzstan':'xxxxxxxxxx',
            'Taiwan' :'xxxxxx',
            'SouthKorea' :'xxxxxxxxxx',
            'USA':'xxx',
            'Vietnam' :'xxxxxxx',
            'Singapore' :'xxxxxxxxx',
            'BJ':'**'
        }
    }, 
    { task:'saveData',     model:'LNSSCoreTerritory',     dataRef:'nssTerritory',  outputFile:'data_nss_territory.js', log:'... generating <yellow>[count] territories</yellow> '    },



    //// LNSSDonBatch
    { task:'readModel',    model:'LNSSDonBatch',     dataRef:'nssDonBatch', filter:{ 'donBatch_dateCreated': {'>=':'20130101'} } },
    { task:'obscureDonBatch', dataRef:'nssDonBatch', keys:{ ren:KEY_PERSON_DATA, nsc:'nssNSC', territory:'nssNSCTerritory' }},
    { task:'saveData',     model:'LNSSDonBatch',     dataRef:'nssDonBatch',  outputFile:'data_nss_don_batch.js', log:'... generating <yellow>[count] don batch entries</yellow> '    },




    //// LNSSPayrollTransactions
    { task:'readModel',    model:'LNSSPayrollTransactions',     dataRef:'nssPayrollTransactions', filter:{ 'nsstransaction_date': {'>=':'20130101'} } },
    {
        task:'mapAtoB',
        dataRef:'nssPayrollTransactions',
        // mapRef:'assignLocationData',
        mapValues:[ 
            { nsstransaction_processedBy: "Coulson, Phil (Agent)"},
            { nsstransaction_processedBy: "Fury, Nick (Director)"},
            { nsstransaction_processedBy: "Rogers, Steve (Captain)"},
            { nsstransaction_processedBy: "Stark, Tony (Millionaire/Playboy/Philanthropist)"},
            { nsstransaction_processedBy: "Banner, Bruce (Doctor)"}
        ],
        field:'nsstransaction_processedBy',
        methodEmpty:'roundrobin'
    },
    { task:'saveData',     model:'LNSSPayrollTransactions',     dataRef:'nssPayrollTransactions',  outputFile:'data_nss_payroll_transactions.js', log:'... generating <yellow>[count] payroll transactions</yellow> '    },



    //// LNSSDonBatch
    { 
        task:'createArrayOfFieldValues',
        dataRef:KEY_PERSON_DATA,
        destDataRef:'listRenGUIDs',
        field:'ren_guid'
    },
    { task:'readModel',    model:'LNSSRen',     dataRef:'nssRen', fieldIn:{ ren_guid: 'listRenGUIDs' } },
    { task:'mixRenNewGUID', dataRef:'nssRen',     dataRefRen:KEY_PERSON_DATA,     field:'ren_guid',  newValue:'new_ren_guid' },  
    { task:'saveData',     model:'LNSSRen',     dataRef:'nssRen',  outputFile:'data_nss_ren.js', log:'... generating <yellow>[count] nss ren entries</yellow> '    },




    // Finalize All the People entries:
    { 
        task:'updatePersonGUIDs',
        model:'LHRISRen',      
        dataRef:KEY_PERSON_DATA,           
    },
    { task:'saveData', dataRef:KEY_PERSON_DATA,  model:'LHRISRen', outputFile:'data_hris_ren.js', log:'... generating <yellow>[count] people</yellow> ' }
    
]
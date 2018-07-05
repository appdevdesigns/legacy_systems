/**
* HRISRen
*
* @module      :: Model
* @description :: A short summary of how this model works and what it represents.
*
*/

module.exports = {

    tableName: "hris_ren_data",
    autoCreatedAt: false,
    autoUpdatedAt: false,
    autoPK: false,
    migrate: 'safe',

    connection: ['legacy_hris'],


    attributes: {

        id: { 
            columnName: 'ren_id',
            type: 'integer',
            size: 11,
            primaryKey: true,
            autoIncrement: true
        },

        ren_guid: {
            type: 'string',
            size: 45
        },

        rentype_id: {
            model: 'LHRISRenType'
        },

        family_id: {
            model:'LHRISFamily'
        },

        ren_surname: {
            type: 'string',
            size: 45
        },

        ren_givenname: {
            type: 'string',
            size: 45
        },

        ren_namecharacters: {
            type: 'string',
            size: 45
        },

        ren_namepinyin: {
            type: 'string',
            size: 45
        },

        ren_preferredname: {
            type: 'string',
            size: 45
        },

        ren_birthdate   : {
            type: "date",
            defaultsTo: "0000-00-00",
            required: false
        },


        ren_deathdate   : {
            type: "date",
            defaultsTo: "0000-00-00",
            required: false
        },


        gender_id: {
            model: 'LHRISGender'
        },

        maritalstatus_id: {
            model: 'LHRISMaritalStatus'
        },


        ethnicity_id: {
            model: 'LHRISEthnicity'
        },


        ren_primarycitizenship: {
            model: 'LHRISCountry'
        },

        statustype_id: {
            model: 'LHRISRenStatusType'
        },

        ren_isfamilypoc: {
            type: 'integer',
            size: 1
        },

        ren_preferredlang: {
            model: 'LHRISLanguage'
        },
        
        translations: {
            collection: 'LHRISRenTrans',
            via: 'ren_id'
        },
        
        /*
        ren_pocid: {
            model: 'LHRISRen'
        },
        */

        //ren_picture : '?BLOB?',
        
        emails: {
            collection:'LHRISEmail',
            via:'ren_id'
        },

        phones: {
            collection: 'LHRISPhone',
            via: 'ren_id'
        },
        
        altContacts: {
            collection: 'LHRISAltContact',
            via: 'ren_id'
        },
        
        assignments: {
            collection: 'LHRISAssignment',
            via: 'ren_id'
        },
        
        attachments: {
            collection: 'LHRISXRefAttachmentRen',
            via: 'ren_id'
        },
        
        dependents: {
            collection: 'LHRISDependent',
            via: 'ren_id'
        },
        
        education: {
            collection: 'LHRISEducation',
            via: 'ren_id'
        },
        
        interests: {
            collection: 'LHRISInterest',
            via: 'ren_id'
        },
        
        medical: {
            collection: 'LHRISMedical',
            via: 'ren_id'
        },
        
        passports: {
            collection: 'LHRISPassport',
            via: 'ren_id'
        },
        
        talents: {
            collection: 'LHRISTalent',
            via: 'ren_id'
        },
        
        training: {
            collection: 'LHRISTraining',
            via: 'ren_id'
        },
        
        languages: {
            collection: 'LHRISXRefRenLanguageProficiency',
            via: 'ren_id'
        },
        
        change_group: {
            collection: "LHRISChangeGroup",
            via: "ren_id"
        },
        
        change_requester: {
            collection: "LHRISChangeGroup",
            via: "changegroup_requester_id"
        },
        
        change_approver: {
            collection: "LHRISChangeGroup",
            via: "changegroup_approver_id"
        },
        
        report: {
            collection: "LHRISReport",
            via: "ren_id"
        },
        
        report_weight: {
            collection: "LHRISReportWeight",
            via: "ren_id"
        },
        
        perm_access: {
            collection: "LHRISPermAccess",
            via: "ren_id"
        },
        
        marriage_request: {
            collection: "LHRISRen",
            via: "marriagerequest_requestorrenid"
        },
        
        marriage_joinee: {
            collection: "LHRISRen",
            via: "marriagerequest_joineerenid"
        },
        
        "worker": {
            collection: "LHRISWorker",
            via: "ren_id"
        }, 
        
        xref_perm_filter: {
            collection: "LHRISXRefPermRenFilter",
            via: "ren_id"
        },

    }

};

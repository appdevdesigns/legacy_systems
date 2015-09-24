/**
* LHRISAssignLocation.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var AD = require('ad-utils');

module.exports = {

    // tableName:"lhris_assign_location_data",
    tableName:"hris_assign_location_data",
    autoCreatedAt:false,
    autoUpdatedAt:false,
    autoPK:false,
    // migrate:'safe',  // don't update the tables!



    connection:"legacy_hris",
// connection:"hris",



    attributes: {

        location_id : {
            type : "integer",
            size : 11,
            primaryKey : true,
            autoIncrement : true
        }, 

        location_guid : {
            type : "string",
            size : 45
        }, 

        locationtype_id : {
            type : "integer",
            size : 11
        }, 

        parent_id : {
            model:'LHRISAssignLocation'
        }, 

        translations:{
            collection:'LHRISAssignLocationTrans',
            via:'location_id'
        },

        locations:{
            collection:'LHRISAssignLocation',
            via:'parent_id'
        },


        team_id: {
            collection:'LHRISXRefTeamLocation',
            via:'location_id'
        }


    },
    
    
    ////////////////////////////
    // Model class methods
    ////////////////////////////
    
    /**
     * Produces a list of all locations and their immediate parents.
     * The location name and type are included in English.
     *
     * Used by mapToRegion()
     *
     * @return
     *      Deferred
     */
    hierarchyList: function() {
        var dfd = AD.sal.Deferred();
        
        LHRISAssignLocation.query("\
            SELECT \
                locd.location_id, \
                loct.location_label, \
                loctt.locationtype_label AS 'type', \
                locd.parent_id \
            FROM \
                hris_assign_location_data locd \
                JOIN hris_assign_location_trans loct \
                    ON locd.location_id = loct.location_id \
                    AND loct.language_code = 'en' \
                JOIN hris_assign_locationtype_trans loctt \
                    ON locd.locationtype_id = loctt.locationtype_id \
                    AND loctt.language_code = 'en' \
            ORDER BY \
                locd.location_id \
        ", function(err, results) {
            if (err) {
                console.error(err);
                dfd.reject(err);
            } else {
                dfd.resolve(results);
            }
        });
        
        return dfd;
    },
    
    
    /**
     * Produces a list of all locations with the regions that they are in.
     * Also produces a list of regions and the locations they contain.
     *
     * locations: {
     *          <location_id>: { 
     *              location_id: <int>,
     *              location_label: <string>,
     *              type: <string>,
     *              parent_id: <int>,
     *              region_location_id: <int>
     *          },
     *          ...
     *       }
     *
     * regions: {
     *              <region location_id>: {
     *                  location_id: <int>,
     *                  name: <string>,
     *                  children: [ <int>, <int>, ... ]
     *              },
     *              ...
     *          }
     *
     * @return Deferred
     *      resolves with fn(locations, regions)
     */
    mapToRegion: function() {
        var dfd = AD.sal.Deferred();
        
        LHRISAssignLocation.hierarchyList()
        .fail(dfd.reject)
        .done(function(list) {
            var locations = {};
            var regions = {/*
                <region location_id>: {
                    "location_id": <region location_id>,
                    "name": <region location_label>,
                    "children": [ <child location_id>, ... ]
                },
                ...
            */};
            var rollUps = {/*
                <location_id>: <parent location_id>,
                ...
            */};
            
            // First pass to build rollups and regions list
            for (var i=0; i<list.length; i++) {
                var row = list[i];
                if (row.type == 'Region') {
                    regions[row.location_id] = {
                        "location_id": row.location_id,
                        "name": row.location_label,
                        "children": []
                    };
                }
                rollUps[row.location_id] = row.parent_id;
                locations[row.location_id] = row;
            }
            
            for (var i=0; i<list.length; i++) {
                var row = list[i];
                var locID = row.location_id;
                
                // Find the region that this location is a child of
                while (!regions[locID] && rollUps[locID]) {
                    locID = rollUps[locID];
                }
                
                // Add the region to the row's data
                locations[row.location_id].region_location_id = locID;
                
                // Add this location under that region
                if (regions[locID]) {
                    regions[locID].children.push( row.location_id );
                }
            }
            
            dfd.resolve(locations, regions);
        });
        
        return dfd;
    }
    
};


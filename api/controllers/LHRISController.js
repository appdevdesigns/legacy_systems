/**
* LHRISController.js
*
*/

module.exports = {
    
    /**
     * Fetches an array of primary assignments belonging to members of the
     * current user's family.
     */
    familyPrimaryAssignments: function(req, res) {
        
        var renID = req.user.userModel.ren_id;
        if (renID) {
            LHRISAssignment.familyPrimaryAssignments(renID)
            .then((list) => {
                res.send(list);
            })
            .catch((err) => {
                res.AD.error(err);
            });
        }
        else {
            res.send([]);
        }
    }
    
};


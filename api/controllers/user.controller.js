var express = require('express');
var User = require('../models/user');

var UserController = (function() {

    var index = function(req, res, next)
    {
        res.json({
            success: true,
            msg: "User Routes form ctrl"
        })
    }

    var update = function(req, res, next) {
        var userId = req.params["id"];
        
        if(!userId) {
            return res.json({ success: false, msg: "Missing user ID" });
        }

        var updates = {
            firstName: req.body["firstName"],
            lastName: req.body["lastName"],
            email: req.body["email"]
        }

        User.findByIdAndUpdate(userId, userUpdates,
        {
            $set: { 
                firstName: updates.firstName,
                lastName: updates.lastName,
                email: updates.email
            }
        },{
            new: true
        },
        function(err, user) {
            if (err) {
                return res.json({ success: false, msg: "Could not find you.", err: err });
            }



            res.json({
                success: true,
                msg: "You\'re account has been updated!",
                user: user.toJSON()
            })

        });
    }

    // functions and variables returned here are considered public
    return {
        update: update
    }

})();

module.exports = UserController;
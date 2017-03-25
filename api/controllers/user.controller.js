var express = require('express');
var User = require('../models/user');

var UserController = (function() {

    var update = function(req, res, next) {
        var id = req.headers["_id"];
        
        if(!id) {
            return res.json({ success: false, msg: "Missing id" });
        }

        var updates = {
            firstName: req.body["firstName"],
            lastName: req.body["lastName"],
            email: req.body["email"]
        }

        User.findOneAndUpdate({ _id: id },
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
                user: user
            })

        });
    }

    // for some reason "delete" will not work as a method name......
    var deleteAccount = function(req, res, next) {
        var id = req.headers["_id"];

        if (!id) {
            return res.json({ success: false, msg: "Missing id" });
        }

        User.findOneAndRemove({ _id: id }, function(err, user) {
            if (err) {
                return res.json({ success: false, msg: "Could not delete your account. Please try again." });
            }

            return res.json({
                success: true
            });
        });
    }

    // functions and variables returned here are considered public
    return {
        update: update,
        deleteAccount: deleteAccount 
    }

})();

module.exports = UserController;
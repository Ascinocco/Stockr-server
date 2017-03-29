var express = require('express');
var User = require('../models/user');

var UserController = (function() {

    var update = function(req, res, next) {
        var user = req["currentUser"];
        var token = req["currentToken"];
        
        if(!user) {
            return res.json({ success: false, msg: "Missing user" });
        }

        if (req.body["firstName"]) {
            user.firstName = req.body["firstName"];
        }

        if (req.body["lastName"]) {
            user.lastName = req.body["lastName"];
        }

        if (req.body["email"]) {
            user.email = req.body["email"]; 
        }


        user.save(function(err, user) {
            if (err) {
                console.log(err);
                return res.json({
                    success: false,
                    msg: "Error updating your account"
                })
            }

            res.set('x-access-token', token);
            res.set('user', user.toJSON());
            return res.json({
                success: true,
                msg: "Your account has been updated!",
                user: user.toJSON()
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
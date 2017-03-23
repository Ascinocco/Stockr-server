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
        var id = req.headers["id"];
        
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

    // functions and variables returned here are considered public
    return {
        update: update
    }

})();

module.exports = UserController;
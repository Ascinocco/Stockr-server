var express = require('express');
var jwt = require('jsonwebtoken');
var User = require('../models/user');
var config = require('../config/config')

var AuthController = (function() {

    var login = function (req, res, next) {
        var tempUser = { email: req.body.email, password: req.body.password };

        User.findOne({ email: tempUser.email }, function(err, user) {
            if (err) {
                return res.json({ success: false, msg: "We\'ve experience a server error when trying to log you in" });
            }

            if (!user) {
                return res.json({ success: false, msg: "We could not locate your account" });
            }

            user.comparePassword(tempUser.password, function(err, isMatch) {
                if (!isMatch) {
                    return res.json({ success: false, msg: "The password we have on file does not match the password you entered"});
                }

                // issue token
                var token = jwt.sign(user.toJSON(), config.secret, {
                    expiresIn: '8h'
                });

                user.token = token;
                user.save(function(err, user) {
                    if (err) {
                        return res.json({ success: false, msg: "Could not update your token" });
                    }

                    // set token header
                    res.set('x-access-token', token);

                    return res.json({
                        success: true,
                        msg: "Welcome " + user.firstName,
                        user: user.toJSON()
                    });

                })
            });
        }); 
    }

    var register = function (req, res, next) {
        var DUPLICATE_RECORD_ERROR = 11000;

        console.log(req.body);

        // compare password
        if (req.body.user.password !== req.body.confirmPassword) {
            return res.json({
                success: false,
                msg: "The passwords you entered do not match"
            });
        }

        var newUser = new User({
            firstName: req.body.user.firstName,
            lastName: req.body.user.lastName,
            email: req.body.user.email,
            password: req.body.user.password
        });

        newUser.save(function(err, user) {
            if (err) {
                if (err.code === DUPLICATE_RECORD_ERROR) {
                    return res.json({ success: false, msg: "The email you entered is already in use" });
                }

                if (err.name === "ValidationError") {
                    return res.json({ success: false, msg: "You might be missing a field, double check please" });
                }

                return res.json({ success: false, msg: "Something went horribly wrong, please try again" });
            }

            var token = jwt.sign(user.toJSON(), config.secret, {
                expiresIn: '8h'
            })

            user.token = token;
            user.save(function(err, user) {
                if (err) {
                    return res.json({ success: false, msg: "Could not update your token" });
                }

                res.set('x-access-token', token);

                return res.json({
                    success: true,
                    msg: "Your account has been created! Follow some stocks",
                    user: user.toJSON()
                });
            });
        });
    }

    // functions and variables returned here are considered public
    return {
        login: login,
        register: register
    }

})();

module.exports = AuthController;
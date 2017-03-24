var express = require('express');
var jwt = require('jsonwebtoken');
var User = require('../models/user');
var config = require('../config/config');

var AuthMiddleware = (function() {
    var checkToken = function(req, res, next) {
        var token = req.headers["x-access-token"];
        var id = req.headers["_id"];

        if (token && id) {

            jwt.verify(token, config.secret, function(err, decoded) {
                if (err) {
                    if (err.name === "TokenExpiredError") {
                        return res.json({
                            success: false,
                            msg: "Invalid Token"
                        })
                    }

                    if (err.name === "JsonWebTokenError") {
                        return res.json({
                            success: false,
                            msg: "Invalid Token"
                        })
                    }

                    return res.json({
                        success: false,
                        msg: "Failed to Authenticate"
                    })
                }

                User.findOne({ _id: id }, function(err, user) {
                    if (err) {
                        console.log(err);
                        return res.json({
                            success: false,
                            msg: "An error occured looking you up"
                        });
                    }

                    if (user.token !== token) {
                        return res.json({
                            success: false,
                            msg: "Could not find an association between you and the token provided"
                        });
                    }

                    res.set('id', user._id);
                    res.set('x-access-token', user.token);
                    next();
                });
            });

        } else {
            res.json({
                success: false,
                msg: "No token or id provided"
            })
        }
    }

    return {
        checkToken: checkToken
    }
})();

module.exports = AuthMiddleware;
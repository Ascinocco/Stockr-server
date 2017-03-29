var express = require('express');
var jwt = require('jsonwebtoken');
var User = require('../models/user');
var config = require('../config/config');

var AuthMiddleware = (function() {
    var checkToken = function(req, res, next) {
        var token = req.headers["x-access-token"];

        if (token) {

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

                User.findOne({'token.value': token }, function(err, user) {
                    if (err) {
                        console.log(err);
                        return res.json({
                            success: false,
                            msg: "An error occured looking you up"
                        });
                    }

                    try {
                        if (user.token.valid && user.token.value === token) {
                            req["currentToken"] = token;
                            req["currentUser"] = user;
                            next();
                        } else {
                            return res.json({
                                success: false,
                                msg: "Could not find an association between you and the token provided"
                            });
                        }
                    } catch (err) {
                        console.log(err);
                        return res.json({
                            success: false,
                            msg: "No active login found"
                        })
                    }
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
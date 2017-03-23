var express = require('express');
var jwt = require('jsonwebtoken');
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

                // move on if no errors with token
                next();

            });

        } else {
            res.json({
                success: false,
                msg: "No token provided"
            })
        }
    }

    return {
        checkToken: checkToken
    }
})();

module.exports = AuthMiddleware;
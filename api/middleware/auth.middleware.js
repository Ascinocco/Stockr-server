var express = require('express');
var jwt = require('jsonwebtoken');
var config = require('../config/config');

var AuthMiddleware = (function() {
    var checkToken = function(req, res, next) {
        var token = req.headers["x-access-token"];

        if (token) {

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
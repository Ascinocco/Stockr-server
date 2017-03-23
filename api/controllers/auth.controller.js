var express = require('express');

var AuthController = (function() {

    var index = function(req, res, next)
    {
        res.json({
            success: true,
            msg: "Auth Routes form ctrl"
        })
    }

    // functions and variables returned here are considered public
    return {
        index: index
    }

})();

module.exports = AuthController;
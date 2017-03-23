var express = require('express');

var UserController = (function() {

    var index = function(req, res, next)
    {
        res.json({
            success: true,
            msg: "User Routes form ctrl"
        })
    }

    // functions and variables returned here are considered public
    return {
        index: index
    }

})();

module.exports = UserController;
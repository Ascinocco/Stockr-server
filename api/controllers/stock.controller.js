var express = require('express');

var StockController = (function() {

    var index = function(req, res, next)
    {
        res.json({
            success: true,
            msg: "Stock Routes form ctrl"
        })
    }

    // functions and variables returned here are considered public
    return {
        index: index
    }

})();

module.exports = StockController;
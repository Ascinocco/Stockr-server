var express = require('express');
var User = require('../models/user');

var StockController = (function() {

    // returns all stocks a user is subscribed to
    var feed = function(req, res, next)
    {
        res.json({
            success: true,
            msg: "Stock Routes form ctrl"
        })
    }

    var search = function() {

    }

    var add = function() {

    }

    var remove = function() {

    }

    // realistically I should be getting all of the stocks and filtering based on revenue or market share or something
    // however the yahoo finance api makes it hard to do this and I don't have enough server horsepower to
    // so I googled to the most popular stocks and picked some and those will be the default
    var popular = function() {

    }

    // functions and variables returned here are considered public
    return {
        feed: feed,
        search: search,
        add: add,
        remove: remove,
        popular: popular
    }

})();

module.exports = StockController;
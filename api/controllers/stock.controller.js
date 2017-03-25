var express = require('express');
var request = require('request');
var Baby = require('babyparse');
var User = require('../models/user');

var StockController = (function() {

    var basicFormat = [
        's', 'n', 'a'
    ];

    // returns all stocks a user is subscribed to
    var feed = function(req, res, next)
    {
       
    }

    var search = function(req, res, next) {

    }

    var add = function(req, res, next) {

    }

    var remove = function(req, res, next) {

    }

    // realistically I should be getting all of the stocks and filtering based on revenue or market share or something
    // however the yahoo finance api makes it hard to do this and I don't have enough server horsepower to
    // so I googled to the most popular stocks and picked some and those will be the default
    var popular = function(req, res, next) {
        var symbols = [ 'AAPL', 'GOOG', 'GE', 'MSFT' ];
        var url = buildStockQueryString(symbols, basicFormat);
        var options = assembleRequest(url);

        request(options, function(error, response, csvStockData) {
            if (error) {
                console.error('ERROR!!!---------');
                console.error(error);
            }
            
            var jsonStockData = Baby.parse(csvStockData, {
                quotes: true,
                quoteChar: '"',
                delimiter: ',',
                header: false,
                newLine: '\n'
            });

            console.log(jsonStockData);

            res.json({
                success: true

            })
        });
    }

    /**
     * 
     * @param {Array} symbols - array of stock symbols 
     * @param {Array} formats - array of format options for yahoo finance api
     */
    var buildStockQueryString = function(symbols, formats) {
        var url = "http://download.finance.yahoo.com/d/quotes.csv?";
        var assembledSymbols = "s=";
        var assembledFormats = "&f=";

        for (var symbol = 0; symbol < symbols.length; symbol++) {
            assembledSymbols += symbols[symbol].toString() + "+";
        }

        for (var format = 0; format < formats.length; format++) {
            assembledFormats += formats[format].toString();
        }

        // remove + from the end of the assembled symbols
        assembledSymbols = assembledSymbols.substring(0, assembledSymbols.length - 1);

        // assemble complete URL
        url += assembledSymbols + assembledFormats;

        return url;
    }

    var assembleRequest = function(yahooFinanceQueryString) {

        var options = {
            url: yahooFinanceQueryString,
            method: 'POST',
        }

        return options;
    }

   var resultArrayToJson = function(resultArray) {

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
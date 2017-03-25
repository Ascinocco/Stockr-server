var express = require('express');
var request = require('request');
var Baby = require('babyparse');
var User = require('../models/user');

var StockController = (function() {

    // since the yahoo finance api is convoluted as fuck
    // im building out a mapping with human readable symbols
    var STOCK_FORMATER_KEYS = {
        SYMBOL: 's',
        NAME: 'n',
        ASKING_PRICE: 'a',
        
        TODAYS_HIGHEST_BID: 'h',
        TODAYS_LOWEST_BID: 'g',
        
        CHANGE_IN_PERCENT: 'c6',
        
        LAST_TRADE: 'l',
        
        THIS_WEEKS_HIGHEST_PRICE: 'k',
        THIS_WEEKS_LOWEST_PRICE: 'j',
        
        EARNINGS_PER_SHARE: 'e',
        
        WEEKS_RANGE: 'w',

        CHANGE_FROM_THIS_WEEKS_HIGH_IN_PERCENT: 'k5',
        CHANGE_FROM_THIS_WEEKS_HIGH_IN_DECIMAL: 'k4',

        CHANGE_FROM_THIS_WEEKS_LOW_IN_PERCENT: 'j6',
        CHANGE_FROM_THIS_WEEKS_LOW_IN_DECIMAL: 'j5'
    };

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
        var url = buildStockQueryString(symbols, {
            SYMBOL: STOCK_FORMATER_KEYS.SYMBOL,
            NAME: STOCK_FORMATER_KEYS.NAME,
            ASKING_PRICE: STOCK_FORMATER_KEYS.ASKING_PRICE
        });
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

        console.log(formats);

        for (var key in formats) {
            if (STOCK_FORMATER_KEYS.hasOwnProperty(key)) {
                assembledFormats += STOCK_FORMATER_KEYS[key];
            }
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
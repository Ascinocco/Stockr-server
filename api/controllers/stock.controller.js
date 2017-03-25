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
        var symbols = [ 'AAPL', 'GOOG', 'GE', 'MSFT'];
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
            
            var jsonResults = Baby.parse(csvStockData, {
                quotes: true,
                quoteChar: '"',
                delimiter: ',',
                header: false,
                newLine: '\n'
            });

            var jsonStockData = resultsArrayToArryOfJson(jsonResults.data);
            jsonResults.data = jsonStockData;

            res.json({
                success: true,
                jsonResults: jsonResults

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

        console.log(url);

        return url;
    }

    var assembleRequest = function(yahooFinanceQueryString) {

        var options = {
            url: yahooFinanceQueryString,
            method: 'POST',
        }

        return options;
    }

    /**
     * Since we know what order the array will be in everytime
     * we can pretty easily map it to a json object
     * 
     * I would like to note that I'm not proud of this
     * but given the time constraints and other assignments
     * this will do
     * 
     * TODO: better name for method
     * TODO: Never speak of this function as long as i live.
     * 
     * @param {Array} resultArray 
     */
   var resultsArrayToArryOfJson = function(resultsArray) {
        var resultsArrayOfJson = [];

        for (var result = 0; result < resultsArray.length; result++) {
            var tempResult = {};
            
            if (resultsArray[result][0] != false) {
                tempResult["SYMBOL"] = resultsArray[result][0];
            }
            if (resultsArray[result][1] != false) {
                tempResult["NAME"] = resultsArray[result][1];
            }
            if (resultsArray[result][2] != false) {
                tempResult["ASKING_PRICE"] = resultsArray[result][2];
            }
            if (resultsArray[result][3] != false) {
                tempResult["TODAYS_HIGHEST_BID"] = resultsArray[result][3];
            }
            if (resultsArray[result][4] != false) {
                tempResult["TODAYS_LOWEST_BID"] = resultsArray[result][4];
            }
            if (resultsArray[result][5] != false) {
                tempResult["CHANGE_IN_PERCENT"] = resultsArray[result][5];
            }
            if (resultsArray[result][6] != false) {
                tempResult["LAST_TRADE"] = resultsArray[result][6];
            }
            if (resultsArray[result][7] != false) {
                tempResult["THIS_WEEKS_HIGHEST_PRICE"] = resultsArray[result][7];
            }
            if (resultsArray[result][8] != false) {
                tempResult["THIS_WEEKS_LOWEST_PRICE"] = resultsArray[result][8];
            }
            if (resultsArray[result][9] != false) {
                tempResult["EARNINGS_PER_SHARE"] = resultsArray[result][9];
            }
            if (resultsArray[result][10] != false) {
                tempResult["WEEKS_RANGE"] = resultsArray[result][10];
            }
            if (resultsArray[result][11] != false) {
                tempResult["CHANGE_FROM_THIS_WEEKS_HIGH_IN_PERCENT"] = resultsArray[result][11];
            }
            if (resultsArray[result][12] != false) {
                tempResult["CHANGE_FROM_THIS_WEEKS_HIGH_IN_DECIMAL"] = resultsArray[result][12];
            }
            if (resultsArray[result][13] != false) {
                tempResult["CHANGE_FROM_THIS_WEEKS_LOW_IN_PERCENT"] = resultsArray[result][13];
            }
            if (resultsArray[result][14] != false) {
                tempResult["CHANGE_FROM_THIS_WEEKS_LOW_IN_DECIMAL"] = resultsArray[result][14];
            }

            resultsArrayOfJson.push(tempResult);
        }

        // remove last value on array, it is always undefined, not sure why
        resultsArrayOfJson.splice(-1, 1);
        return resultsArrayOfJson;
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
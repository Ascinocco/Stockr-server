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
        var id = req.headers["_id"];
        User.findOne({ _id: id }, function(err, user) {
            var symbols = [];

            for (var i = 0; i < user.stocks.length; i++) {
                symbols.push(user.stocks[i]);
            }

            if (symbols.length > 0) {
                // using default small set of symbols for non-detailed view
                var url = buildStockQueryString(symbols, {
                    SYMBOL: STOCK_FORMATER_KEYS.SYMBOL,
                    NAME: STOCK_FORMATER_KEYS.NAME,
                    ASKING_PRICE: STOCK_FORMATER_KEYS.ASKING_PRICE
                });

                var options = assembleRequest(url);

                request(options, function(error, response, csvStockData) {
                    if (error) {
                        return res.json({
                            success: false,
                            msg: 'Could not fetch stocks'
                        });
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

                    return res.json({
                        success: true,
                        jsonResults: jsonResults
                    })
                });

            } else {
                return res.json({
                    success: false,
                    msg: 'You are not watching any stocks!'
                });
            }
        });
    }

    var details = function(req, res, next) {
        var symbol = req.body.symbol;
        var symbols = [];

        console.log(symbols.length);

        if (symbol) {
            symbols.push(symbol);
            var url = buildStockQueryString(symbols, STOCK_FORMATER_KEYS);
            var options = assembleRequest(url);

            request(options, function(error, response, csvStockData) {
                if (error) {
                    return res.json({
                        success: false,
                        msg: 'Could not fetch stocks'
                    });
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

                return res.json({
                    success: true,
                    jsonResults: jsonResults
                })
            });

        } else {
            return res.json({
                success: false,
                msg: 'No stock symbol provided'
            });
        }
    }

    var search = function(req, res, next) {
        // check if stock exists
        var checkSymbols = [ symbol ];
        var checkUrl = buildStockQueryString(checkSymbols, { SYMBOL: STOCK_FORMATER_KEYS.SYMBOL });
        var checkOptions = assembleRequest(url);

        request(checkOptions, function(error, response, checkedCsvStock) {
            if (error) {
                return res.json({
                    success: false,
                    msg: 'The stock you tried to add for (' + symbol + ') could not be found'
                });
            }
                    
            var jsonResults = Baby.parse(checkedCsvStock, {
                quotes: true,
                quoteChar: '"',
                delimiter: ',',
                header: false,
                newLine: '\n'
            });

            var jsonStockData = resultsArrayToArryOfJson(jsonResults.data);
                jsonResults.data = jsonStockData;
            })
    }

    var add = function(req, res, next) {
        var symbol = req.body.symbol;
        var id = req.headers["_id"];
        if (symbol) {
            User.findOne({ _id: id }, function(err, user) {

                // validation here
                // check if user is already watching stock
                if (user.stocks.length > 0) {
                    for (var i = 0; i < user.stocks.length; i++) {
                        if (user.stocks[i] === symbol) {
                             return res.json({
                                success: false,
                                msg: 'You are already watching ' + symbol
                            })
                        }
                    }
                }

                // since we already check if the stock exists when we search for it
                // there is no need to check for it again here

                user.stocks.push(symbol);
                user.save(function(err) {
                    if (err) {
                        return res.json({
                            success: false,
                            msg: 'Could not save the stock'
                        });
                    }

                    return res.json({
                        success: true,
                        msg: "Stock: " + symbol + " has been added to your watch list" 
                    });
                });

            })
        } else {
            return res.json({
                success: false,
                msg: 'Missing stock symbol'
            })
        }
    }

    var remove = function(req, res, next) {
        var id = req.headers["_id"];
        var symbol = req.body.symbol;

        if (symbol) {
            User.findOne({ _id: id }, function(err, user) {
                if (err) {
                    return res.json({
                        success: false,
                        msg: 'We couldn\'t find your account :/'
                    })
                }

                for (var i = 0; i < user.stocks.length; i++) {
                    if (user.stocks[i] === symbol) {
                        user.stocks.splice(i, 1);
                    }
                }

                user.save(function(err) {
                    if (err) {
                        return res.json({
                            success: false,
                            msg: 'Failed to remove stock'
                        })
                    }

                    return res.json({
                        success: true,
                        msg: 'You are no longer watching ' + symbol
                    });
                })
            })
        } else {
            return res.json({
                success: false,
                msg: 'Missing stock symbol'
            })
        }
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
                return res.json({
                    success: false,
                    msg: 'Could not fetch stocks'
                });
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

            return res.json({
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
        popular: popular,
        details: details
    }

})();

module.exports = StockController;
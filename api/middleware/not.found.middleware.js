var express = require('express');

var PageNotFoundMiddleware = (function() {
    var handler = function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    }

    return {
        handler: handler
    }
})();

module.exports = PageNotFoundMiddleware;
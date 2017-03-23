var express = require('express');

var ErrorHandlerMiddleware = (function() {
    var handler = function(req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = err

        // render the error page
        res.status(err.status || 500);
        res.json({ err: err });
    }

    return {
        handler: handler
    }
})();

module.exports = ErrorHandlerMiddleware;
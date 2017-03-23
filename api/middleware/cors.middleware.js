var express = require('express');

var CORSMiddleware = (function() {
    var allowCORS = function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
        res.header('Access-Control-Expose-Headers', 'Connection,Content-Length,Content-Type,Date,ETag,X-Powered-By,x-access-token');
        res.header('Access-Control-Allow-Headers', 'Connection,Content-Length,Content-Type,Date,ETag,X-Powered-By,x-access-token');
        next();
    }

    return {
        allowCORS: allowCORS
    }
})();

module.exports = CORSMiddleware;
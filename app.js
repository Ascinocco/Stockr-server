var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');

// routes
var authRoutes = require('./api/routes/auth.routes');
var userRoutes = require('./api/routes/user.routes');
var stockRoutes = require('./api/routes/stock.routes');

// middleware
var CORSMiddleware = require('./api/middleware/cors.middleware');
var ErrorHandlerMiddlware = require('./api/middleware/error.handler.middleware');
var PageNotFoundMiddleware = require('./api/middleware/not.found.middleware');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// routes
app.use('/api/auth/', authRoutes);
app.use('/api/user/', userRoutes);
app.use('/api/stocks/', stockRoutes)

// middleware

// cors
app.use(cors());
app.use(CORSMiddleware.allowCORS);

// catch 404 and forward to error handler
app.use(PageNotFoundMiddleware.handler);

// error handler
app.use(ErrorHandlerMiddlware.handler);

module.exports = app;

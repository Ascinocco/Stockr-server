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

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// routes
app.use('/api/auth/', authRoutes);
app.use('/api/users/', userRoutes);
app.use('/api/stocks', stockRoutes)

// my middleware
app.use(cors());
app.use(CORSMiddleware.allowCORS);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

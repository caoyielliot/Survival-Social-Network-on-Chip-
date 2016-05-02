"use strict";

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: "SSNOC SV-1",
    resave: true,
    saveUninitialized: true,
    rolling: true,
    store: new FileStore()
    // cookie : { secure : false, maxAge : (24 * 60 * 60 * 1000) }
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

// ADD YOUR ROUTES HERE !!
var routes = require('./routes/index');
var users = require('./routes/users');
var messages = require('./routes/messages');
var announcements = require('./routes/announcements');
var status = require('./routes/status');
var profile=require('./routes/profile');
app.use('/', routes);
app.use('/users', users);
app.use('/messages', messages);
app.use('/announcements', announcements);
app.use('/status', status);
app.use('/profile',profile);

// RESTful API
app.use('/messages/announcements', announcements);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
//var logger = require('morgan');
var morgan = require('morgan');
var fs = require('fs');

var mongoose = require("mongoose");
var bodyParser = require("body-parser");
const url = 'mongodb+srv://mei:jddor7iwJVAZb7vJ@cluster0-rpsnw.mongodb.net/stocks';
var db = mongoose.connect(
  url
);

var Company = require('./models/company');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//logging
var winston = require('./config/winston');
app.use(morgan('combined', { stream: winston.stream }));
//end logging

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

var companyRouter = express.Router();
 companyRouter = require('./routes/company')(Company);
app.use('/companies', companyRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

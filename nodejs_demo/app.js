const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const compression = require('compression')
const logger = require('morgan');
require('es6-promise').polyfill();

const config = require('./config')


// as a best practice
// all global variables should be referenced via global. syntax
// and their names should always begin with g
const red = "\x1b[31m"
const green = "\x1b[32m"
const yellow = "\x1b[33m"
const blue = "\x1b[34m"

global.gConfig = config;
global.gColor = {
  red,
  green,
  yellow,
  blue
}

const app = express();

// view engine setup
app.set('views', path.join(__dirname, '../app/'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression())

app.use(require('./src/routes'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err)
  res.status(err.status || 500);
  res.send(err.message || err.toString());
});


module.exports = app;

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');




const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: '@tpro2023@@',
  resave: false,
  saveUninitialized: true
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // Log the error
  console.error(err);

  // Set locals for error handling
  res.locals.message = err?.message || 'Internal Server Error';
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Set the HTTP status code based on the error or default to 500 (Internal Server Error)
  res.status(err?.status || 500);

  // Render the error page
  res.render('error');
});


module.exports = app;

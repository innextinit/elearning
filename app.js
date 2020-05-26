var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var handler = require('express-handlebars');
const {check, validationResult} = require('express-validator/check');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var fs = require('fs');
var multer = require('multer');
mongoose.connect('MongoDB://localhost/Elearn');
var db =mongoose.connection;
 

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var classes = require('./routes/classes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', handler({
  defaultLayout: 'layout',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layout')})); // this is to set the default Layout to be a file name layout in the views folder
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// express session
app.use(session({
  secret: ('./node_modules/secret/secret.md'),
  saveUninitialized: true,
  resave: true
}));


// passport
app.use(passport.initialize());
app.use(passport.session());


// express validator
app.use(require('express-validator')({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.');
    var root = namespace.shift();
    var formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg : msg,
      value: value
    };
  }
}));

app.use(multer({
  dest: './upload/',
  rename: function(fieldname, filename){
    return filename;
  },
}).single('classImg'));

// connect-flash for flash messages
app.use(require('connect-flash')());
// giving a global var so that when we get a message its saved in messages which can be access 
app.use(function (req, res, next) {
  res.locals.messages = require('express-message')(req, res);
  if (req.url == '/') {
    res.locals.isHome = true;
  }
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/classes', classes);

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
app.listen(5000, function(){
  console.log("server running on port 5000");
});
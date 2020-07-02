var dotenv = require('dotenv');
dotenv.config();
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
var url = process.env.DATABASE_URL;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
 

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var classes = require('./routes/classes');
var students = require('./routes/students');
var teachers = require('./routes/teachers');

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
  resave: true,
  cookie: {maxAge: 180000} // 3mins
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
  next();
});

// make the user object global in all views
app.get('*', function(req, res, next) {
  // put user into res.locals for easy access from templates
  res.locals.user = req.user || null;
  if(req.user){
    res.locals.type = req.user.type;
  }
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/classes', classes);
app.use('/students', students);
app.use('/teachers', teachers);

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

var port = process.env.PORT;
console.log(process.env.PORT)
app.listen(port, function(){
  console.log(`server running on port ${port}`);
});

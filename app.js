const dotenv = require('dotenv');
dotenv.config();
<<<<<<< HEAD
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const Handlebars = require('handlebars');
const handler = require('express-handlebars')
// Only do this, if you have full control over the templates that are executed in the server
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const flash = require("connect-flash");
const methodOverride = require('method-override');

// connection to MongoDB
const url = process.env.DATABASE_URL;
mongoose.connect(url, { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(() => {
  console.log("MongoDB connected");
}).catch((error) => {
  console.log("unable to connect MongoDB");
  console.log(error);
});

const indexRouter = require('./routes/index');
const users = require('./routes/users');
const courses = require('./routes/courses');
=======
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
>>>>>>> b734ba488fa917e0da82c461bc8e01d9bbb01cf4

const app = express();

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
app.use(methodOverride('_method'));


// express session
app.use(session({
  secret: ('./node_modules/secret/secret.md'),
  saveUninitialized: true,
  resave: true,
<<<<<<< HEAD
  cookie: {maxAge: 720000} // 12mins
=======
  cookie: {maxAge: 180000} // 3mins
>>>>>>> b734ba488fa917e0da82c461bc8e01d9bbb01cf4
}));


// passport
app.use(passport.initialize());
app.use(passport.session());


// express validator
app.use(require('express-validator')({
  errorFormatter: function(param, msg, value) {
    const namespace = param.split('.');
    const root = namespace.shift();
    const formParam = root;

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

// connect-flash for flash messages
app.use(flash());
// giving a global const so that when we get a message its saved in messages which can be access 
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
<<<<<<< HEAD
app.use('/users', users);
app.use('/courses', courses);
=======
app.use('/users', usersRouter);
app.use('/classes', classes);
app.use('/students', students);
app.use('/teachers', teachers);
>>>>>>> b734ba488fa917e0da82c461bc8e01d9bbb01cf4

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

const port = process.env.PORT;
console.log(process.env.PORT)
app.listen(port, function(){
  console.log(`server running on port ${port}`);
});

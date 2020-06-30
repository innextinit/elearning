var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const { check, validationResult } = require('express-validator/check');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcryptjs = require('bcryptjs');


var User = require('../models/user');
var Student = require('../models/student');
var Teacher = require('../models/teacher');

router.get('/', ensureAuthenticated, function(req, res, next) {
  res.render('layout/index', {layout: false});
});

router.get('/upload', ensureAuthenticated, function(req, res, next) {
  res.render('users/upload', {layout: false});
});

router.get('/edit', ensureAuthenticated, function(req, res, next) {
  res.render('users/edit', {layout: false});
});

router.get('/changepw', ensureAuthenticated, function(req, res, next) {
  res.render('users/changepw', {layout: false});
});

router.get('/forgotpw', ensureAuthenticated, function(req, res, next) {
  res.render('users/forgotpw', {layout: false});
});

router.get('/2fauth', ensureAuthenticated, function(req, res, next) {
  res.render('users/2fauth', {layout: false});
});

router.get('/register', function(req, res, next) {
  res.render('users/register', { layout: false} );
});

router.post('/register', function(req, res, next) {
  var type = req.body.type;
  console.log(type);
  var name = req.body.name;
  console.log(name);
  var street_address = req.body.street_address;
  console.log(street_address);
  var city = req.body.city;
  console.log(city);
  var state = req.body.state;
  console.log(state);
  var zip = req.body.zip;
  console.log(zip);
  var username = req.body.username;
  console.log(username);
  var email = req.body.email;
  console.log(email);
  var password = req.body.password;
  console.log(password);
  var password2 = req.body.password2;
  console.log(password2);
  var ipAddress = req.connection.address();
  console.log(ipAddress);

  // form validation
  check('name', 'Name is required').not().isEmpty().isLowercase().isLength({min: 4, max: 30});
  check('street_address', 'Street Address is required').not().isEmpty().isLowercase().isLength({min: 4, max: 35});
  check('city', 'City is required').not().isEmpty().isLowercase().isLength({min: 2, max: 20});
  check('state', 'State is required').not().isEmpty().isLowercase().isLength({min: 2, max: 20});
  check('zip', 'Zip is required').not().isEmpty().isNumeric().isLength({min: 6, max: 10});
  check('email', 'Email is required').not().isEmpty().isLowercase().isLength({min: 11, max: 35});
  check('email', 'Email not valid').isEmail().normalizeEmail().custom((value, {req}) => {
    return new Promise((resolve, reject) => 
    {User.findOne({email: req.body.email}, function(err, user){
      if(err){reject(new Error('Server Error'));
    }if(Boolean(user)){
      reject(new Error ('Email in Use'));
    }
     resolve(true);
    });
  });
  });
  check('username', 'Username is required').not().isEmpty().isLength({min:3, max:14})
    .custom((value, {req}) => {
      return new Promise((resolve, reject) => 
      {User.findOne({username: req.body.username}, function(err, user){
        if(err){reject(new Error('Server Error'));
      }if(Boolean(user)){
        reject(new Error ('Username in Use'));
      }
      resolve(true);
      });
    });
    });
  check('password', 'Password is required').not().isEmpty().isLength({min:10, max: 35});
  // to check if password match with password2
  check('password2', 'Password do not match, please check').equals(req.body.password);
  // end of validation

    // check for errors during the validation
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.render('register').json({
      errors: errors.array(),
      // to return all input value back to the user if there was error during filling
      type: type,
      name: name,
      street_address: street_address,
      city: city,
      state: state,
      zip: zip,
      email: email,
      username: username,
      password: password
    }); // end of error check, if no errors then create new user
  } 
  else {
    // to create newUser
    var newUser = new User({
      email: email,
      username: username,
      password: password,
      type: type,
      ipAddress: ipAddress,
      admin: false,
      active: false
    });

    var newStudent = new Student({
      name: name,
      address: [{
        street_address: street_address,
        city: city,
        state: state,
        zip: zip
      }],
      email: email,
      username: username,
      ipAddress: ipAddress,
      admin: false,
      active: false
    });

    var newTeacher = new Teacher({
      name: name,
      address: [{
        street_address: street_address,
        city: city,
        state: state,
        zip: zip
      }],
      email: email,
      username: username,
      ipAddress: ipAddress,
      admin: false,
      active: false,
    });

    // type check
    if (type == 'student') {
      User.saveStudent(newUser, newStudent, function(err, user){
        console.log('Student created');
        console.log(newStudent);
        console.log(newUser);
      });
    } else {
      User.saveTeacher(newUser, newTeacher, function(err, user){
        console.log('Teacher created');
        console.log(newTeacher);
        console.log(newUser);
      });
    } // end of else for type check
    req.flash('success', 'User added.');
    res.redirect('/');
  } // end of else for validation
}); 


router.get('/login', function(req, res, next) {
  res.render('users/login', { layout: false} );
});

router.post('/login', passport.authenticate('local', {failureRedirect: '/users/login', failureFlash: 'Wrong Username or Password'}), function(req, res, next){
  var ipAddress = req.connection.address();
  console.log(ipAddress);
  var username = req.body.username;
  console.log(username);
  req.flash('success', `Welcome`);
  res.redirect('/users');
});

// localStrategy
passport.use(new LocalStrategy( 
  function(username, password, done){
    User.getUserByUsername(username, function(err, user){ 
      if(err) {return done(err);}
      if(!user){
        console.log('Unknow User');
        return done(null, false,{message: 'Unknown User'});
      }
      
      User.comparePassword(password, user.password, function(err, isMatch){
        console.log(user.password);
        console.log(user.username);
        console.log(user.type);
        if(isMatch){
          return done(null, user);
        } else {
          console.log('Invalid Password');
          return done(null, false, {message:'Invalid Password'});
        }
      });

    });
  }
));

passport.serializeUser(function(User, done){
  done(null, User._id);
});

passport.deserializeUser(function(id, done){
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.get('/logout', ensureAuthenticated, function(req, res){
  req.logout();
  req.session.destroy(function(err, callback){
    res.redirect('/');
  });

});

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
};


module.exports = router;
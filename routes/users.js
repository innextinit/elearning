<<<<<<< HEAD
const express = require("express");
const router = express.Router();
const { check, validationResult, header } = require("express-validator/check");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require('multer');

const User = require("../models/user");
const user = require("../models/user")
const auth = require("../controller/auth");
// const { path } = require("../app");

router.get("/student", auth.ensureAuthenticated, auth.isStudent, auth.verifyToken, (req, res) => {
  res.render("users/student", { layout: false });
});

router.get("/tutor", auth.ensureAuthenticated, auth.isTutor, auth.verifyToken, (req, res) => {
  res.render("users/tutor", { layout: false });
});

router.get("/admin", auth.ensureAuthenticated, auth.isAdmin, auth.verifyToken, (req, res) => {
  res.render("users/admin", { layout: false });
})

router.get("/register", (req, res) => {
  res.render("users/register", { layout: false} );
});

router.post("/register", async (req, res) => {
  const name = req.body.name;
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  if (!name || !username || !email || !password) {
  return res.status(400).send("please fill all fields")        
}
  check("name", "Name use en-US only").not().isEmpty().isLowercase().isLength({min: 4, max: 30}).isAlphanumeric("en-US");
  check("email", "Email is required").not().isEmpty().isLowercase().isLength({min: 11, max: 35});
  check("username", "Username is required").not().isEmpty().isLowercase().isLength({min:3, max:14}).isAlphanumeric("en-US");
  check("password", "Password is case_senstitive and en-US only").not().isEmpty().isLength({min:10, max: 35}).isISSN({case_sensitive: true}).isAlphanumeric("en-US");
  
  const uniqueUser = User.findOne({username});
  if (uniqueUser) {
    req.flash("failed", `${username} is registered`);
}
  const uniqueEmail = User.findOne({email});
  if (uniqueEmail) {
    req.flash("failed", `${email} is registered`);
}
  
  // create new user
  const newUser = new User({
    name: name,
    username: username,
    email: email,
    password: password,
    role: "student",
    hasActivated: "false"
=======
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
>>>>>>> b734ba488fa917e0da82c461bc8e01d9bbb01cf4
  });

  // hassh password
  const salt = await bcrypt.genSalt(15)
  const hash = await bcrypt.hash(newUser.password, salt)
  newUser.password = hash;
  console.log(newUser.password);

  // access token to verfiy email
  const accessToken = jwt.sign({
      username, 
      userId: newUser._id,
      role: user.role
    },
    process.env.TOKEN_KEY,
    { expiresIn: "1hrs" });

  newUser.token = accessToken;

  await newUser.save(function(err) {
    if (err) throw err;
    console.log(newUser);
  });
<<<<<<< HEAD

  req.flash("success", "User added.");
  res.redirect("/users/login");
}); 

router.get("/login", (req, res) => {
  res.render("users/login", { layout: false} );
});

router.post("/login", passport.authenticate("local", {
  failureRedirect: "/users/login",
  failureFlash: "Wrong Username or Password",
  session: true
  }),
    async (user, res) => {
    const role = user.user.role;
    if (role == 'student') {
      res.redirect("/users/student");
    } else if (role == 'tutor') {
      res.redirect("/users/tutor");
    } else if (role == 'admin') {
      res.redirect("/users/admin");
    } else {
      res.redirect("/users/logout");
    }

=======
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
    res.redirect('/users/login');
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
>>>>>>> b734ba488fa917e0da82c461bc8e01d9bbb01cf4
});

// localStrategy
passport.use(new LocalStrategy( 
  async (username, password, done) => {
    User.getUserByUsername(username, (err, user) => { 
      if(err) {return done(err);}
      if(!user){
        console.log('Unknow User');
        return done(null, false,{message: 'Unknown User'});
      }
      
<<<<<<< HEAD
      User.comparePassword(password, user.password, async (err, isMatch) => {
=======
      User.comparePassword(password, user.password, function(err, isMatch){
        console.log(user.password);
        console.log(user.username);
        console.log(user.type);
>>>>>>> b734ba488fa917e0da82c461bc8e01d9bbb01cf4
        if(isMatch){
          const accessToken = jwt.sign({ username, userId: user._id, role: user.role }, process.env.TOKEN_KEY, { expiresIn: "1hrs"});
          const result = await User.findByIdAndUpdate(user._id, {token: accessToken}, {useFindAndModify: false, new: true, upsert: true});
          return done(null, result);
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

<<<<<<< HEAD
router.get("/logout", auth.ensureAuthenticated, (req, res) => {
  req.logout();
  req.session.destroy((err, callback) => {
    res.redirect("/users/login");
=======
router.get('/logout', ensureAuthenticated, function(req, res){
  req.logout();
  req.session.destroy(function(err, callback){
    res.redirect('/');
>>>>>>> b734ba488fa917e0da82c461bc8e01d9bbb01cf4
  });
});

router.get("/betutor", auth.ensureAuthenticated, auth.verifyToken, auth.makeTutor, (req, res) => {
  res.redirect("/users/tutor");
});

<<<<<<< HEAD
router.get("/beadmin", auth.ensureAuthenticated, auth.verifyToken, auth.makeAdmin, (req, res) => {
  res.redirect("/users/admin");
});

// get list of all user courses
router.get("/courses", auth.ensureAuthenticated, auth.verifyToken, (req, res) => {
  User.findOne(req.user.username, function(err, User){
      if (err) {
          console.log(err);
          res.send(err);
      } else {
          console.log(req.user.username);
          res.render("users/courses", {"user": User, layout: false} );
      }
  }); 
});

// // this is to register a user for the course
// router.post("/courses", ensureAuthenticated, function(req, res, next) {
//   const username = req.user.username;
//   console.log(username);
//   const course_id = req.body.course_id;
//   console.log(course_id);
//   const course_title = req.body.course_title;
//   console.log(course_title);

//   const newCourse = [];
//   newCourse.username = username;
//   newCourse.course_id = course_id;
//   newCourse.course_title = course_title;
 
//   User.saveNewCourse(newCourse, function(err, user){
//       if(err) throw err;
//       console.log(user);
//       console.log(newCourse);
//       console.log(user.courses);
//   });
//   req.flash("successs", "course added");
//   res.redirect("/users/courses");
// });

// router.get('/courses/register', ensureAuthenticated, function(req, res, next) {
// res.render("courses/register")
// });

// router.post('/courses/register', ensureAuthenticated, function(req, res, next) {
//   var username = req.user.username;
//   console.log(username);
//   var course_id = req.body.course_id;
//   console.log(course_id);
//   var course_title = req.body.course_title;
//   console.log(course_title);

//   var newCourse = {
//       username: username,
//       course_id: course_id,
//       course_title: course_title
//   };

//   Teacher.saveNewCourse(newCourse, function(err, user){
//       if(err) throw err;
//       console.log(user);
//       console.log(newCourse);
//   });
//   req.flash('successs', 'course added');
//   res.redirect('teachers/courses');
// });

// router.get("/picture", ensureAuthenticated, function(req, res) {
//   res.render("users/picture", {layout: false});
// });
// // this is for when i am sending POST req to add new course to inculde this part for the courseImg picture that is include.

// router.post("/picture", ensureAuthenticated, upload.single("userImg"), async function(req, res, next){
//   try {
//     const Img = fs.readFileSync(req.file.path);
//     const encodeImg = Img.toString("base64");
//     const userImg = ({
//       contentType: req.file.mimetype,
//       data: new Buffer(encodeImg, "base64")
//     });
//     console.log(userImg);

//     User.findOneAndUpdate(username, {"userImg": userImg},
//     {upsert: true, new: true, save: true}
//     );

//     const file = req.file;
//     if (!file) {
//       req.flash("failed", "please pick a file for upload")
//     }
//   } catch (error) {
    
//   }

//   // res.redirect("/users/picture");
// });
// router.get("/edit", ensureAuthenticated, function(req, res, next) {
//   res.render("users/edit", {layout: false});
// });

// router.get("/changepw", ensureAuthenticated, function(req, res, next) {
//   res.render("users/changepw", {layout: false});
// });

// router.get("/forgotpw", ensureAuthenticated, function(req, res, next) {
//   res.render("users/forgotpw", {layout: false});
// });

// router.get("/2fauth", ensureAuthenticated, function(req, res, next) {
//   res.render("users/2fauth", {layout: false});
// });


// function isTutor(req, res, next) {
//   if (req.user.role=='tutor') {
//     return next()
//   } else {
//     req.flash("failed", "You dont have access to create ")
//   }
// };

// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, "../upload/userImg");
//   },
//   filename: function(req, file, cb) {
//     cb(null, Date.now() + file.originalname.toLowerCase());
//   },
// });
// console.log(storage);

// const upload = multer({
//   storage: storage,
//   limits: {
//     fieldNameSize: 100,
//     fileSize: 4*1024*1024,
//     fieldSize: 4*1024*1024,
//     files: 1
//   },
//   fileFilter: function(req, file, cb) {
//     const filetypes = /jpeg|jpg|png|/;
//     // const mimetype = filetypes.test(file.mimetype);
//     // const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

//     // if (mimetype && extname) {
//     //   return cb (null, true);
//     // } else {
//     //   cb ("Error: File upload support the following filetype only - " + filetypes)
//     // }

//     if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
//       return cb(new Error(`File upload support the following filetype only - ${filetypes}`), false);
//     }
//     cb(null, true);
//   }
// });
// console.log(upload)
=======
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
};
>>>>>>> b734ba488fa917e0da82c461bc8e01d9bbb01cf4


module.exports = router;
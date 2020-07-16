const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const multer = require('multer');
const fs = require("fs")

const User = require("../models/user");
const user = require("../models/user");
const { request } = require("http");
// const { path } = require("../app");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "../upload/userImg");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname.toLowerCase());
  },
});
console.log(storage);

const upload = multer({
  storage: storage,
  limits: {
    fieldNameSize: 100,
    fileSize: 4*1024*1024,
    fieldSize: 4*1024*1024,
    files: 1
  },
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|/;
    // const mimetype = filetypes.test(file.mimetype);
    // const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    // if (mimetype && extname) {
    //   return cb (null, true);
    // } else {
    //   cb ("Error: File upload support the following filetype only - " + filetypes)
    // }

    if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
      return cb(new Error(`File upload support the following filetype only - ${filetypes}`), false);
    }
    cb(null, true);
  }
});
console.log(upload)

router.get("/register", function(req, res, next) {
  res.render("users/register", { layout: false} );
});

router.post("/register", function(req, res, next) {
  const name = req.body.name;
  console.log(name);
  const street_address = req.body.street_address;
  console.log(street_address);
  const city = req.body.city;
  console.log(city);
  const state = req.body.state;
  console.log(state);
  const zip = req.body.zip;
  console.log(zip);
  const username = req.body.username;
  console.log(username);
  const email = req.body.email;
  console.log(email);
  const password = req.body.password;
  console.log(password);
  const password2 = req.body.password2;
  console.log(password2);
  const ipAddress = req.connection.address();
  console.log(ipAddress);

  // form validation
  check("name", "Name is required").not().isEmpty().isLowercase().isLength({min: 4, max: 30});
  check("street_address", "Street Address is required").not().isEmpty().isLowercase().isLength({min: 4, max: 35});
  check("city", "City is required").not().isEmpty().isLowercase().isLength({min: 2, max: 20});
  check("state", "State is required").not().isEmpty().isLowercase().isLength({min: 2, max: 20});
  check("zip", "Zip is required").not().isEmpty().isNumeric().isLength({min: 6, max: 10});
  check("email", "Email is required").not().isEmpty().isLowercase().isLength({min: 11, max: 35});
  check("email", "Email not valid").isEmail().normalizeEmail().custom((value, {req}) => {
    return new Promise((resolve, reject) => 
    {User.findOne({email: req.body.email}, function(err, user){
      if(err){reject(new Error("Server Error"));
    }if(Boolean(user)){
      reject(new Error ("Email in Use"));
    }
     resolve(true);
    });
  });
  });
  check("username", "Username is required").not().isEmpty().isLength({min:3, max:14})
    .custom((value, {req}) => {
      return new Promise((resolve, reject) => 
      {User.findOne({username: req.body.username}, function(err, user){
        if(err){reject(new Error("Server Error"));
      }if(Boolean(user)){
        reject(new Error ("Username in Use"));
      }
      resolve(true);
      });
    });
    });
  check("password", "Password is required").not().isEmpty().isLength({min:10, max: 35});
  // to check if password match with password2
  check("password2", "Password do not match, please check").equals(req.body.password);
  // end of validation

    // check for errors during the validation
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.render("register").json({
      errors: errors.array(),
      // to return all input value back to the user if there was error during filling
      name: name,
      street_address: street_address,
      city: city,
      state: state,
      zip: zip,
      email: email,
      username: username,
    }); // end of error check, if no errors then create new user
  } 
  else {
    // to create newUser
    const newUser = new User({
      name: name,
      address: {
        street_address: street_address,
        city: city,
        state: state,
        zip: zip
      },
      email: email,
      username: username,
      password: password,
      ipAddress: ipAddress,
      admin: false,
      active: false
    });

    User.saveUser(newUser, function(err, user){
      console.log("User created");
      console.log(newUser);
      });
    req.flash("success", "User added.");
    res.redirect("/users/login");
  } // end of else for validation
}); 

router.get("/login", function(req, res, next) {
  res.render("users/login", { layout: false} );
});

router.post("/login", passport.authenticate("local", {failureRedirect: "/users/login", failureFlash: "Wrong Username or Password", session: true}), function(req, res){
  const ipAddress = req.connection.address();
  console.log(ipAddress);
  const username = req.body.username;
  console.log(username);
  console.log(user);
  req.flash("success", `Welcome`);
  res.redirect("/");
});

// get list of all user courses
router.get("/courses", ensureAuthenticated, function(req, res){
  User.getUserByUsername(req.user.username, function(err, User){
      if (err) {
          console.log(err);
          res.send(err);
      } else {
          console.log(req.user.username);
          res.render("users/courses", {"user": User, layout: false} );
      }
  }); 
});

// this is to register a user for the course
router.post("/courses", ensureAuthenticated, function(req, res, next) {
  const username = req.user.username;
  console.log(username);
  const course_id = req.body.course_id;
  console.log(course_id);
  const course_title = req.body.course_title;
  console.log(course_title);

  const newCourse = [];
  newCourse.username = username;
  newCourse.course_id = course_id;
  newCourse.course_title = course_title;
 
  User.saveNewCourse(newCourse, function(err, user){
      if(err) throw err;
      console.log(user);
      console.log(newCourse);
      console.log(user.courses);
  });
  req.flash("successs", "course added");
  res.redirect("/users/courses");
});

router.get('/courses/register', ensureAuthenticated, function(req, res, next) {
res.render("courses/register")
});

router.post('/courses/register', ensureAuthenticated, function(req, res, next) {
  var username = req.user.username;
  console.log(username);
  var course_id = req.body.course_id;
  console.log(course_id);
  var course_title = req.body.course_title;
  console.log(course_title);

  var newCourse = {
      username: username,
      course_id: course_id,
      course_title: course_title
  };

  Teacher.saveNewCourse(newCourse, function(err, user){
      if(err) throw err;
      console.log(user);
      console.log(newCourse);
  });
  req.flash('successs', 'course added');
  res.redirect('teachers/courses');
});

router.get('/courses/:id/lessons/new', ensureAuthenticated, function(req, res){
  res.render('teachers/newlesson', {'course_id': req.params.id, layout: false} );
});

router.post('/courses/:id/lessons/new', ensureAuthenticated, function(req, res){
  var newlesson = {}
  newlesson.course_id = req.params.id;
  newlesson.lesson_number = req.body.lesson_number;
  newlesson.lesson_title = req.body.lesson_title;
  newlesson.lesson_body = req.body.lesson_body;

  Course.addLesson(newlesson, function(err, lesson){
      console.log('Lesson Added');
  });
  req.flash('success', 'lesson added');
  res.redirect('/teachers/courses');
});

router.get("/upload", ensureAuthenticated, function(req, res) {
  res.render("users/upload", {layout: false});
});
// this is for when i am sending POST req to add new course to inculde this part for the courseImg upload that is include.

router.post("/upload", ensureAuthenticated, upload.single("userImg"), async function(req, res, next){
  try {
    const Img = fs.readFileSync(req.file.path);
    const encodeImg = Img.toString("base64");
    const userImg = ({
      contentType: req.file.mimetype,
      data: new Buffer(encodeImg, "base64")
    });
    console.log(userImg);

    User.findOneAndUpdate(username, {"userImg": userImg},
    {upsert: true, new: true, save: true}
    );

    const file = req.file;
    if (!file) {
      req.flash("failed", "please pick a file for upload")
    }
  } catch (error) {
    
  }

  // res.redirect("/users/upload");
});
router.get("/edit", ensureAuthenticated, function(req, res, next) {
  res.render("users/edit", {layout: false});
});

router.get("/changepw", ensureAuthenticated, function(req, res, next) {
  res.render("users/changepw", {layout: false});
});

router.get("/forgotpw", ensureAuthenticated, function(req, res, next) {
  res.render("users/forgotpw", {layout: false});
});

router.get("/2fauth", ensureAuthenticated, function(req, res, next) {
  res.render("users/2fauth", {layout: false});
});


// localStrategy
passport.use(new LocalStrategy( 
  function(username, password, done){
    User.getUserByUsername(username, function(err, user){ 
      if(err) {return done(err);}
      if(!user){
        console.log("Unknow User");
        return done(null, false,{message: "Unknown User"});
      }
      
      User.comparePassword(password, user.password, function(err, isMatch){
        console.log(user.password);
        console.log(user.username);
        if(isMatch){
          return done(null, user);
        } else {
          console.log("Invalid Password");
          return done(null, false, {message:"Invalid Password"});
        }
      });

    });
  }
));

passport.serializeUser(function(user, done){
  done(null, user._id);
});

passport.deserializeUser(function(id, done){
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.get("/logout", ensureAuthenticated, function(req, res){
  req.logout();
  req.session.destroy(function(err, callback){
    res.redirect("/login");
  });
});

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/users/login");
};

function isTutor(req, res, next) {
  if (req.user.role==tutor) {
    return next()
  } else {
    req.flash("failed", "You dont have access to create ")
  }
}

module.exports = router;
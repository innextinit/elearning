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

});

// localStrategy
passport.use(new LocalStrategy( 
  async (username, password, done) => {
    User.getUserByUsername(username, (err, user) => { 
      if(err) {return done(err);}
      if(!user){
        console.log("Unknow User");
        return done(null, false,{message: "Unknown User"});
      }
      
      User.comparePassword(password, user.password, async (err, isMatch) => {
        if(isMatch){
          const accessToken = jwt.sign({ username, userId: user._id, role: user.role }, process.env.TOKEN_KEY, { expiresIn: "1hrs"});
          const result = await User.findByIdAndUpdate(user._id, {token: accessToken}, {useFindAndModify: false, new: true, upsert: true});
          return done(null, result);
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

router.get("/logout", auth.ensureAuthenticated, (req, res) => {
  req.logout();
  req.session.destroy((err, callback) => {
    res.redirect("/users/login");
  });
});

router.get("/betutor", auth.ensureAuthenticated, auth.verifyToken, auth.makeTutor, (req, res) => {
  res.redirect("/users/tutor");
});

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


module.exports = router;
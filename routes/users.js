const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/user");
const user = require("../models/user");


router.get("/classes", ensureAuthenticated, function(req, res){
  User.getUserByUsername(req.user.username, function(err, User){
      if (err) {
          console.log(err);
          res.send(err);
      } else {
          console.log(req.user.username);
          res.render("users/classes", {"user": User, layout: false} );
      }
  }); 
});

// register for new class
router.post("/classes", function(req, res, next) {
  const username = req.user.username;
  console.log(username);
  const class_id = req.body.class_id;
  console.log(class_id);
  const class_title = req.body.class_title;
  console.log(class_title);

  const newClass = [];
  newClass.username = username;
  newClass.class_id = class_id;
  newClass.class_title = class_title;
 
  User.saveNewClass(newClass, function(err, user){
      if(err) throw err;
      console.log(user);
      console.log(newClass);
      console.log(user.classes);
  });
  req.flash("successs", "class added");
  res.redirect("/users/classes");
});

router.get("/upload", ensureAuthenticated, function(req, res, next) {
  res.render("users/upload", {layout: false});
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
      address: [{
        street_address: street_address,
        city: city,
        state: state,
        zip: zip
      }],
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
  req.flash("success", `Welcome`);
  res.redirect("/");
  console.log(user);
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
  res.redirect("/login");
};


module.exports = router;
var express = require('express');
var router = express.Router();

var Class = require('../models/class');
var Teacher = require('../models/teacher');

router.get('/register', function(req, res){
    res.render('teachers/register', {layout: false})
});
router.post('/register', function(req, res){
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
    // create newTeacher
    const newTeacher = new Teacher({
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

      User.saveTeacher(newUser, newTeacher, function(err, user){
        console.log("Teacher created");
        console.log(newTeacher);
        console.log(newUser);
      });
    }
})


router.get("/login", function(req, res, next) {
    res.render("teachers/login", { layout: false} );
  });
  
  router.post("/login", passport.authenticate("local", {failureRedirect: "/teachers/login", failureFlash: "Wrong Username or Password"}), function(req, res, next){
    const ipAddress = req.connection.address();
    console.log(ipAddress);
    const username = req.body.username;
    console.log(username);
    req.flash("success", `Welcome`);
    res.redirect("/");
    console.log(user);
    console.log(user.classes);
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
          console.log(user.type);
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
  
  passport.serializeUser(function(User, done){
    done(null, User._id);
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

router.get('/classes', ensureAuthenticated, function(req, res){
    Teacher.getTeacherByUsername([req.user.username], function(err, teacher){
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.render('teachers/classes', {layout: false} );
        }
    });
});

router.post('/classes/register', ensureAuthenticated, function(req, res, next) {
    var teacher_username = req.user.teacher_username;
    console.log(teacher_username);
    var class_id = req.body.class_id;
    console.log(class_id);
    var class_title = req.body.class_title;
    console.log(class_title);

    var newClass = [{
        teacher_username: teacher_username,
        class_id: class_id,
        class_title: class_title
    }];

    Teacher.saveNewClass(newClass, function(err, teacher){
        if(err) throw err;
        console.log(teacher);
        console.log(newClass);
    });
    req.flash('successs', 'class added');
    res.redirect('teachers/classes');
});

router.get('/classes/:id/lessons/new', ensureAuthenticated, function(req, res){
    res.render('teachers/newlesson', {'class_id': req.params.id, layout: false} );
});

router.post('/classes/:id/lessons/new', ensureAuthenticated, function(req, res){
    var newlesson = []
    newlesson.class_id = req.params.id;
    newlesson.lesson_number = req.body.lesson_number;
    newlesson.lesson_title = req.body.lesson_title;
    newlesson.lesson_body = req.body.lesson_body;

    Class.addLesson(newlesson, function(err, lesson){
        console.log('Lesson Added');
    });
    req.flash('success', 'lesson added');
    res.redirect('/teachers/classes');
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect('/');
}
  
module.exports = router;
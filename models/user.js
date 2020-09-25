<<<<<<< HEAD
const mongoose =      require("mongoose");
const fs =            require("fs");
const multer =        require("multer");
const bcryptjs =      require("bcrypt");
const validator =     require("validator");

// User Schema (this is the definition of the input the DB will take more like stating the head of table)
const UserSchema = new mongoose.Schema({
  name: {
    type:          String,
    index:         true,
    trim:          true,
    require:       true,
  },
  address: {
    street_address: {type: String, trim: true},
    city:           {type: String, trim: true},
    state:          {type: String, trim: true},
    zip:            {type: Number, trim: true}
  },
=======
var mongoose = require("mongoose");
var fs = require("fs");
var multer = require("multer");
var bcryptjs = require('bcryptjs');

// User Schema (this is the definition of the input the DB will take more like stating the head of table)
var UserSchema = new mongoose.Schema({
>>>>>>> b734ba488fa917e0da82c461bc8e01d9bbb01cf4
  username: {
    type:          String,
    index:         true,
    trim:          true,
    require:       true,
    unique:        true,
  },
  email: {
    type:         String,
    trim:         true,
    require:      true,
    unique:       true,
    validate: value => {
      if (!validator.isEmail(value)) {
        throw new Error({
          error : "Invalid Email"
        });
      }
    }
  },
  userImg: {
    data:         Buffer, // using Buffer, which allows us to store our image as data in the form of arrays
    contentType:  String,
  },
<<<<<<< HEAD
  token: {
    type:         String,
    required:     true
  },
  role: {
    type:          String,
    enum:          ["student", "tutor", "admin"],
    default:       "student"
  },
  classes: {
      type:        [mongoose.Schema.Types.ObjectId], ref: "Class"
    },
=======
  type: {
    type:String,
    require: true
  },
  UserImg: {
    data: Buffer, // using Buffer, which allows us to store our image as data in the form of arrays
    contentType: String,
  }, 
>>>>>>> b734ba488fa917e0da82c461bc8e01d9bbb01cf4
  password: {
    type:          String,
    bcryptjs:      true,
    require:       true,
    trim:          true,
  },
<<<<<<< HEAD
  admin:           false,
  created: {
    type:          Date,
    default:       Date.now()
  },
  title: {
    type:          String,
    enum:          ["Mr", "Mrs", "Dr.", "Prof."]
  },
  hasActivated: {
    type:          Boolean,
    default:       false
  },
  isDisable: {
    type:          Boolean,
    default:       false
  },
  title: {
    type:          String,
    enum:          ["Mr", "Mrs", "Dr.", "Prof."]
  }
}, {timestamps:    true});

// virtual userurl
UserSchema.virtual("url").get(function(){
  return '/user/' + this._id;
=======
  admin: false,
>>>>>>> b734ba488fa917e0da82c461bc8e01d9bbb01cf4
});

// this is to convert this UserSchema in a usable model called User
var User = mongoose.model("User", UserSchema);
module.exports = mongoose.model("User", UserSchema); // then this export the model User so it can be used outside this file.

// To fetch All Useres in the collection Useres in our DB
<<<<<<< HEAD
module.exports.getUserByUsername = function(username, callback) {
    const query = {username: username};
    User.findOne(query, callback);
};

// To fatch just a User in the collection Users in our DB
module.exports.getUserById = function(id, callback) {
  User.findById(id, callback).lean();
};

// To fatch just a teacher in the collection teachers in our DB
module.exports.getTeacherById = function(id, callback) {
  Teacher.findById(id, callback).lean();
};

// save User
module.exports.saveUser = function(newUser, callback) {
    bcryptjs.hash(newUser.password, 15, function(err, hash){
        if (err) throw err;
        newUser.password = hash;
        newUser.save(callback);
        console.log("User is saved");
=======
module.exports.getUserByUsername = function (username, callback) {
    var query = {username: username};
    User.findOne(query, callback).lean();
};

// To fatch just a User in the collection Useres in our DB
module.exports.getUserById = function (id, callback) {
  User.findById(id, callback).lean();
};

// save Student
module.exports.saveStudent = function(newUser, newStudent, callback) {
    bcryptjs.hash(newUser.password, 15, function(err, hash){
        if (err) throw err;

        newUser.password = hash;
        console.log('Student is being svaed');
        newUser.save(callback);
        newStudent.save(callback);
        // async.parallel([newUser.save, newStudent.save], callback);
>>>>>>> b734ba488fa917e0da82c461bc8e01d9bbb01cf4
        console.log(newUser);
        console.log(newStudent);
    });
};

<<<<<<< HEAD
// Compare Password
module.exports.comparePassword = function(usersPassword, hash, callback) {
  bcryptjs.compare(usersPassword, hash, function(err, isMatch){
    if (err) throw err;
    callback(null, isMatch);
  });
};

// newClass
module.exports.saveNewClass = function(newClass, callback){
  User_username = newClass.User_username;
  class_id = newClass.class_id;
  class_title = newClass.class_title;
=======
// save Teacher
module.exports.saveTeacher = function(newUser, newTeacher, callback) {
    bcryptjs.hash(newUser.password, 15, function(err, hash){
        if (err) throw err;
>>>>>>> b734ba488fa917e0da82c461bc8e01d9bbb01cf4

        newUser.password = hash;
        console.log('Teacher is being svaed');
        newUser.save(callback);
        newTeacher.save(callback);
        // async.parallel([newUser.save, newTeacher.save], callback);
        console.log(newUser);
        console.log(newTeacher);
    });
};

<<<<<<< HEAD
function validateName() {
  const name = document.getElementById('name');
  const re = /^[a-zA-Z]{2,10}$/;
  if(!re.test(name.value)){
    name.classList.add('is-invalid');
  }else {
    name.classList.remove('is-invalid');
  }
  
  }
  function validateZip() {
    const zip = document.getElementById('zip');
    const re = /^[0-9]{5}(-[0-9]{4})?$/;
    if(!re.test(zip.value)){
      zip.classList.add('is-invalid');
    }else {
      zip.classList.remove('is-invalid');
    }
  
  }
  function validateEmail() {
    const email = document.getElementById('email');
    const re = /^([a-zA-Z0-9_\-\.]+)@(a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}) $/;
    if(!re.test(email.value)){
      email.classList.add('is-invalid');
    }else {
      email.classList.remove('is-invalid');
    }
  
  }
  function validatePhone() {
    const phone = document.getElementById('phone');
    const re = /^\(?\d{3}\)?[-. ]?\d{4}[-. ]?\d{4}$/;
    if(!re.test(phone.value)){
      phone.classList.add('is-invalid');
    }else {
      phone.classList.remove('is-invalid');
    }  
  
  }
=======
// Compare PAssword
module.exports.comparePassword = function(usersPassword, hash, callback) {
  bcryptjs.compare(usersPassword, hash, function(err, isMatch){
    if (err) throw err;
    callback(null, isMatch);
  });
};

// this is for when i am sending POST req to add new class to inculde this part for the classImg upload that is include.

// app.post('/api/photo', function(req, res){
//     var newClass = new Class();
//     newClass.classImg.data = fs.readFileSync(req.files.userPhoto.path);
//     newClass.classImg.contentType = 'image/png';
//     newClass.save();
// });
>>>>>>> b734ba488fa917e0da82c461bc8e01d9bbb01cf4

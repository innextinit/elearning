var mongoose = require("mongoose");
var fs = require("fs");
var multer = require("multer");
var bcryptjs = require('bcryptjs');

// User Schema (this is the definition of the input the DB will take more like stating the head of table)
var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    index: true,
    trim: true,
    require: true,
  },
  email: {
    type: String,
    trim: true,
    require: true,
  },
  type: {
    type:String,
    require: true
  },
  UserImg: {
    data: Buffer, // using Buffer, which allows us to store our image as data in the form of arrays
    contentType: String,
  }, 
  password: {
    type: String,
    bcryptjs: true,
    require: true,
    trim: true,
  },
  admin: false,
});

// this is to convert this UserSchema in a usable model called User
var User = mongoose.model("User", UserSchema);
module.exports = mongoose.model("User", UserSchema); // then this export the model User so it can be used outside this file.

// To fetch All Useres in the collection Useres in our DB
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
        console.log(newUser);
        console.log(newStudent);
    });
};

// save Teacher
module.exports.saveTeacher = function(newUser, newTeacher, callback) {
    bcryptjs.hash(newUser.password, 15, function(err, hash){
        if (err) throw err;

        newUser.password = hash;
        console.log('Teacher is being svaed');
        newUser.save(callback);
        newTeacher.save(callback);
        // async.parallel([newUser.save, newTeacher.save], callback);
        console.log(newUser);
        console.log(newTeacher);
    });
};

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

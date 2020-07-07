const mongoose = require("mongoose");
const fs = require("fs");
const multer = require("multer");
const bcryptjs = require("bcryptjs");

// Teacher Schema (this is the definition of the input the DB will take more like stating the head of table)
const TeacherSchema = new mongoose.Schema({
  name: {
    type: String,
    index: true,
    trim: true,
    require: true,
  },
  address: [{
    street_address: {type: String, trim: true, require: true},
    city: {type: String, trim: true, require: true},
    state: {type: String, trim: true, require: true},
    zip: {type: Number, trim: true, require: true}
  }],
  username: {
    type: String,
    index: true,
    trim: true,
    require: true,
    unique: true
  },
  email: {
    type: String,
    trim: true,
    require: true,
    unique: true
  },
  TeacherImg: {
    data: Buffer, // using Buffer, which allows us to store our image as data in the form of arrays
    contentType: String,
  },
  classes: [{
    class_id:{type: [mongoose.Schema.Types.ObjectId]},
    class_title:{type: String}
  }],
  admin: false,
  created: {
    type: Date,
    default: Date.now()
  },
  has_activated: {
    type: Boolean,
    default: false
  },
  is_disable: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    enum: ["Mr", "Mrs", "Dr.", "Prof."]
  }
});

// virtual userurl
TeacherSchema.virtual("url").get(function(){
  return '/teacher/' + this._id;
});

// this is to convert this TeacherSchema in a usable model called Teacher
const Teacher = mongoose.model("Teacher", TeacherSchema);
module.exports = mongoose.model("Teacher", TeacherSchema); // then this export the model Teacher so it can be used outside this file.

module.exports.getTeacherByUsername = function(username, callback) {
  const query = {username: username};
  Teacher.findOne(query, callback).lean();
};

// newClass
module.exports.saveNewClass = function(newClass, callback){
  teacher_username = newClass.teacher_username;
  class_id = newClass.class_id;
  class_title = newClass.class_title;

  const query = {username: teacher_username}
  Teacher.findOneAndUpdate(
    query,
    {$push: {"classes": {class_id: class_id, class_title: class_title}}},
    {save: true, upsert: true},
    callback
  ).lean();
};

// save Teacher
module.exports.saveTeacher = function(newUser, newTeacher, callback) {
  bcryptjs.hash(newUser.password, 15, function(err, hash){
      if (err) throw err;

      newUser.password = hash;
      console.log("Teacher is being svaed");
      newUser.save(callback);
      newTeacher.save(callback);
      // async.parallel([newUser.save, newTeacher.save], callback);
      console.log(newUser);
      console.log(newTeacher);
  });
};

// Compare Password
module.exports.comparePassword = function(usersPassword, hash, callback) {
  bcryptjs.compare(usersPassword, hash, function(err, isMatch){
    if (err) throw err;
    callback(null, isMatch);
  });
};

// this is for when i am sending POST req to add new class to inculde this part for the classImg upload that is include.

// app.post("/api/photo", function(req, res){
//     const newClass = new Class();
//     newClass.classImg.data = fs.readFileSync(req.files.userPhoto.path);
//     newClass.classImg.contentType = "image/png";
//     newClass.save();
// });
var mongoose = require("mongoose");
var fs = require("fs");
var multer = require("multer");
var bcryptjs = require('bcryptjs');

// Student Schema (this is the definition of the input the DB will take more like stating the head of table)
var StudentSchema = new mongoose.Schema({
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
  StudentImg: {
    data: Buffer, // using Buffer, which allows us to store our image as data in the form of arrays
    contentType: String,
  },
  classes: [{
    class_id:{type: [mongoose.Schema.Types.ObjectId], ref: 'Class'},
    class_title:{type: String}
  }],
  admin: false,
});

var Student = mongoose.model("Student", StudentSchema);
module.exports = mongoose.model("Student", StudentSchema);

module.exports.getStudentByUsername = function(username, callback) {
  var query = {username: username};
  Student.findOne(query, callback).lean();
};

// newClass
module.exports.saveNewClass = function(newClass, callback){
  student_username = newClass.student_username;
  class_id = newClass.class_id;
  class_title = newClass.class_title;

  var query = {username: student_username}
  Student.findOneAndUpdate(
    query,
    {$push: {"classes": {class_id: class_id, class_title: class_title}}},
    {save: true, upsert: true},
    callback
  ).lean();
};

// this is for when i am sending POST req to add new class to inculde this part for the classImg upload that is include.

// app.post('/api/photo', function(req, res){
//     var newClass = new Class();
//     newClass.classImg.data = fs.readFileSync(req.files.userPhoto.path);
//     newClass.classImg.contentType = 'image/png';
//     newClass.save();
// });
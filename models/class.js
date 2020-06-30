var mongoose = require("mongoose");
var fs = require("fs");
var multer = require("multer");

// Class Schema (this is the definition of the input the DB will take more like stating the head of table)
var ClassSchema = new mongoose.Schema({
  title: {
    type: String,
    index: true,
    trim: true,
    require: true,
    unique: true
  },
  description: {
    type: String,
    trim: true,
    require: true,
  },
  classImg: {
    data: Buffer, // using Buffer, which allows us to store our image as data in the form of arrays
    contentType: String,
  },
  teacher: {
    type: String,
    require: true,
    trim: true,
  },
  lessons: {
    section: {
        lesson_number: { type: Number, require: true },
        lesson_title: { type: String, require: true },
        lesson_body: { type: String, require: true },
    }
  },
  admin: false,
});

// this is to convert this ClassSchema in a usable model called Class
var Class = mongoose.model("Class", ClassSchema);
module.exports = mongoose.model("Class", ClassSchema); // then this export the model Class so it can be used outside this file.

// To fetch All Classes in the collection classes in our DB
module.exports.getClasses = function (foundclasses, limit) {
  Class.find(foundclasses).lean().limit(limit);
};

// To fatch just a Class in the collection classes in our DB
module.exports.getClassById = function (id, callback) {
  Class.findById(id, callback).lean();
};

module.exports.getLesson = function(newlesson, callback){
  class_id = newlesson.class_id;
  lesson_number = newlesson.lesson_number;
  lesson_title = newlesson.lesson_title;
  lesson_body = newlesson.lesson_body;

  Class.findByIdAndUpdate(
    class_id,
    {$push: {"lessons": {lesson_number:lesson_number, lesson_title:lesson_title, lesson_body:lesson_body}}},
    {save: true, upsert: true},
    callback
  );
};

// this is for when i am sending POST req to add new class to inculde this part for the classImg upload that is include.

// app.post('/api/photo', function(req, res){
//     var newClass = new Class();
//     newClass.classImg.data = fs.readFileSync(req.files.userPhoto.path);
//     newClass.classImg.contentType = 'image/png';
//     newClass.save();
// });

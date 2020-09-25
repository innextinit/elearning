var mongoose = require("mongoose");
var fs = require("fs");
var multer = require("multer");
const { ObjectId } = require("mongodb");

// Course Schema (this is the definition of the input the DB will take more like stating the head of table)
var CourseSchema = new mongoose.Schema({
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
  headline: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  isPaid: {
    type: Boolean,
    default: true
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  numTeachers: {
    type: Number,
    default: 1
  },
  numQuizzes: {
    type: Number,
    default: 10
  },
  price: {
    type: Number,
    required: true,
  },
  priceCurrency: {
    type: String,
    default: "USD"
  },
  courseImg: {
    data: Buffer, // using Buffer, which allows us to store our image as data in the form of arrays
    contentType: String,
  },
  teacher: {
    type: ObjectId,
    require: true,
    trim: true,
  },
  created: {
    type: Date,
    default: Date.now()
  },
  archiveTime : {
    type: Date,
    default: Date.now()
  },
  completionRate: {
    type: Number
  },
  primaryCategory: {
    type: [mongoose.Schema.Types.ObjectId], ref: "Category"
  },
  subCategory: {
    type: [mongoose.Schema.Types.ObjectId], ref: "Subcategory"
  },
  language: {
    type: String,
    enum: ["En", "Yr", "Dot", "Sp"]
  },
  statusLabel: {
    type: String,
    enum: ["active", "archive", "deleted", "isPrivate"]
  },
  duration: {
    type: Number
  },
  lessons: {
    type: [mongoose.Schema.Types.ObjectId], ref: "Lesson"
  },
  teacher: {
    type: [mongoose.Schema.Types.ObjectId], ref: "Teacher"
  }
});

// virtual teacher url
CourseSchema.virtual("url").get(function(){
  return '/courses/' + this._id;
});
// this is to convert this CourseSchema in a usable model called Course
var Course = mongoose.model("Course", CourseSchema);
module.exports = mongoose.model("Course", CourseSchema); // then this export the model Course so it can be used outside this file.

// To fetch All Courses in the collection courses in our DB
module.exports.getCourses = function (foundcourses, limit) {
  Course.find(foundcourses).lean().limit(limit);
};

// To fatch just a Course in the collection courses in our DB
module.exports.getCourseById = function (id, callback) {
  Course.findById(id, callback).lean();
};

module.exports.getLesson = function(newlesson, callback){
  course_id = newlesson.course_id;
  lesson_number = newlesson.lesson_number;
  lesson_title = newlesson.lesson_title;
  lesson_body = newlesson.lesson_body;

  Course.findByIdAndUpdate(
    course_id,
    {$push: {"lessons": {lesson_number:lesson_number, lesson_title:lesson_title, lesson_body:lesson_body}}},
    {save: true, upsert: true},
    callback
  );
};

// this is for when i am sending POST req to add new course to inculde this part for the courseImg upload that is include.

// app.post('/api/photo', function(req, res){
//     var newCourse = new Course();
//     newCourse.courseImg.data = fs.readFileSync(req.files.userPhoto.path);
//     newCourse.courseImg.contentType = 'image/png';
//     newCourse.save();
// });

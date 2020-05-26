var mongoose = require('mongoose');
var fs = require('fs');
var multer = require('multer');

// Class Schema (this is the definition of the input the DB will take more like stating the head of table)
var ClassSchema = mongoose.Schema({
    title : {
        type: String,
        index: true,
        trim: true,
        require: true
    },
    description : {
        type: String,
        trim: true,
        require: true
    },
    classImg : {
        data: Buffer, // using Buffer, which allows us to store our image as data in the form of arrays
        contentType: String
    },
    teacher : {
        type: String,
        require: true,
        trim: true
    },
    lessons : [{
        lesson_number:  {type: Number, require: true},
        lesson_title:   {type: String, require: true},
        lesson_body:    {type: String, require: true}
    }],
    admin: false,
});

// this is to convert this ClassSchema in a usable model called Class
var Class = mongoose.model('Class', ClassSchema);
module.exports = mongoose.model('Class', ClassSchema); // then this export the model Class so it can be used outside this file.


// To fetch All Classes in the collection classes in our DB
module.exports.getClasses = function(foundclasses, limit){
    Class.find(foundclasses).limit(limit);
};

// To fatch just a Class in the collection classes in our DB
module.exports.getClassById = function(id, callback){
    Class.findById(id, callback);
};



// this is for when i am sending POST req to add new class to inculde this part for the classImg upload that is include.

// app.post('/api/photo', function(req, res){
//     var newClass = new Class();
//     newClass.classImg.data = fs.readFileSync(req.files.userPhoto.path);
//     newClass.classImg.contentType = 'image/png';
//     newClass.save();
// });
var mongoose = require('mongoose');
var fs = require("fs");
var multer = require("multer");
var bcrypt = require('bcryptjs');

// User Schema (this is the definition of the input the DB will take more like stating the head of table)
var UserSchema = new mongoose.Schema({
    username : {
        type: String,
        minlength: 3,
        maxlength: 14,
        index: {unique: true},
        trim: true,
        require: true
    },
    password : {
        type: String,
        require: true,
        bcrypt: true,
        minlength: 10,
        maxlength: 35
    },
    email : {
        type: String,
        require: true,
        minlength: 11,
        maxlength: 35,
        trim: true,
        index: {unique: true}
    },
    name : {
        type: String,
        trim: true,
        minlength: 4,
        maxlength: 30,
        require: true
    },
    profileImage : {
        data: Buffer, // using Buffer, which allows us to store our image as data in the form of arrays
        contentType: String,
    },
    ipAddress : {
        type: Object,
        require: true
    },
    admin: false,
    active: false
});

// this is to convert this UserSchema in a usable model called User
var User = mongoose.model('User', UserSchema);
module.exports = mongoose.model('User', UserSchema); // then this export the model User so it can be used outside this file.

// this is to save user and hash the password for the new user created in the users.js file
module.exports.createUser = function(newUser, callback){
        bcrypt.hash(newUser.password, 15, function(err, hash){ // this is to call the newUser's password and hash it with 15 saltrounds
            if(err) throw err;
            // set hashed password
            newUser.password = hash; // this is to replace the password of the newUser and replace with the hashed one
            // create User or save the user to MongoDB
            newUser.save(callback);
        });
};

// this is to find user by id
module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
};

// this is to find the username in the DB 
module.exports.getUserByUsername = function(username, callback){
    var query = {username: username};
    User.findOne(query, callback);
};

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch){
        if(err) return callback(err);
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

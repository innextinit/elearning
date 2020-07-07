const mongoose = require("mongoose");
const fs = require("fs");
const multer = require("multer");
const bcryptjs = require("bcryptjs");

// User Schema (this is the definition of the input the DB will take more like stating the head of table)
const UserSchema = new mongoose.Schema({
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
  },
  email: {
    type: String,
    trim: true,
    require: true,
  },
  UserImg: {
    data: Buffer, // using Buffer, which allows us to store our image as data in the form of arrays
    contentType: String,
  },
  classes: [
    {type: [mongoose.Schema.Types.ObjectId], ref: "Class"},
  ],
  password: {
    type: String,
    bcryptjs: true,
    require: true,
    trim: true,
  },
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
UserSchema.virtual("url").get(function(){
  return '/user/' + this._id;
});

// this is to convert this UserSchema in a usable model called User
const User = mongoose.model("User", UserSchema);
// then this export the model User so it can be used outside this file.
module.exports = mongoose.model("User", UserSchema);

// To fetch All Useres in the collection Useres in our DB
module.exports.getUserByUsername = function (username, callback) {
    const query = {username: username};
    User.findOne(query).populate("classes").exec(callback);
};

// To fatch just a User in the collection Users in our DB
module.exports.getUserById = function (id, callback) {
  User.findById(id, callback).lean();
};

// save User
module.exports.saveUser = function(newUser, callback) {
    bcryptjs.hash(newUser.password, 15, function(err, hash){
        if (err) throw err;
        newUser.save(callback);
        newUser.password = hash;
        console.log("User is saved");
        console.log(newUser);
    });
};

// newClass
module.exports.saveNewClass = function(newClass, callback){
  User_username = newClass.User_username;
  class_id = newClass.class_id;
  class_title = newClass.class_title;

  const query = {username: User_username};
  User.findOneAndUpdate(
    query,
    {$push: {"classes": {class_id: class_id, class_title: class_title}}},
    {save: true, upsert: true},
    callback
  ).lean();
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

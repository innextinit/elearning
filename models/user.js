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
  password: {
    type:          String,
    bcryptjs:      true,
    require:       true,
    trim:          true,
  },
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
});

// this is to convert this UserSchema in a usable model called User
const User = mongoose.model("User", UserSchema);
// then this export the model User so it can be used outside this file.
module.exports = mongoose.model("User", UserSchema);

// To fetch All Useres in the collection Useres in our DB
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
        console.log(newUser);
    });
};

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

  const query = {username: User_username};
  User.findOneAndUpdate(
    query,
    {$push: {"classes": {class_id: class_id, class_title: class_title}}},
    {save: true, upsert: true},
    callback
  ).lean();
};

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
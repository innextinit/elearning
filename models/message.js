var mongoose = require("mongoose");
var fs = require("fs");
var multer = require("multer");
var bcryptjs = require('bcryptjs');

// Message Schema (this is the definition of the input the DB will take more like stating the head of table)
var MessageSchema = new mongoose.Schema({
    firstname: {
    type: String,
    index: true,
    trim: true,
    require: true,
  },
  lastname: {
    type: String,
    index: true,
    trim: true,
    require: true,
  },
  email: {
    type: String,
    index: true,
    trim: true,
    require: true,
  },
  subject: {
    type: String,
    index: true,
    trim: true,
    require: true,
  },
  message: {
    type: String,
    index: true,
    trim: true,
    require: true,
  }

});

var Message = mongoose.model("Message", MessageSchema);
module.exports = mongoose.model("Message", MessageSchema);


// newClass
module.exports.saveNewMessage = function(newMessage, callback){
    firstname = firstname;
    lastname = lastname;
    email = email;
    subject = subject;
    message = message;
    username = username;

    newMessage.save(callback);
    console.log(newMessage);
};
var mongoose = require("mongoose");
const validator = require("validator");

// Message Schema (this is the definition of the input the DB will take more like stating the head of table)
var MessageSchema = new mongoose.Schema({
    name: {
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
    validate: value => {
      if (!validator.isEmail(value)) {
        throw new Error({
          error : "Invalid Email"
        });
      }
    }
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
    newMessage.save(callback);
    console.log(newMessage);
};
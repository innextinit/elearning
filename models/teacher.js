var mongoose = require('mongoose');

// Teacher Schema (this is the definition of the input the DB will take more like stating the head of table)
var TeacherSchema = new mongoose.Schema({
    username : {
        type: String,
        minlength: 3,
        maxlength: 14,
        index: {unique: true},
        trim: true,
        require: true
    },
    email : {
        type: String,
        require: true,
        minlength: 11,
        maxlength: 35,
        trim: true,
        index: {unique: true}
    },
    addrress: [{
        street_address: {type: String},
        city: {type: String},
        state: {type: String},
        zip: {type: String}
    }],
    classes : [{
        class_id: {type: [mongoose.Schema.Types.ObjectId]},
        class_title: {type: String}
    }],
    ipAddress : {
        type: Object,
        require: true
    },
    admin: false,
    active: false
});

// this is to convert this TeacherSchema in a usable model called Teacher
var Teacher = mongoose.model('Teacher', TeacherSchema);
module.exports = mongoose.model('Teacher', TeacherSchema); // then this export the model Teacher so it can be used outside this file.
var express = require('express');
var router = express.Router();

var Student = require('../models/student');

router.get('/classes', ensureAuthenticated, function(req, res){
    Student.getStudentByUsername(req.user.username, function(err, student){
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log(req.user.username);
            res.render('students/classes', {'student': student, layout: false} );
        }
    });
});

router.post('/classes/register', ensureAuthenticated, function(req, res, next) {
    var student_username = req.user.student_username;
    console.log(student_username);
    var class_id = req.body.class_id;
    console.log(class_id);
    var class_title = req.body.class_title;
    console.log(class_title);

    var newClass = [{
        student_username: student_username,
        class_id: class_id,
        class_title: class_title
    }];

    Student.saveNewClass(newClass, function(err, student){
        if(err) throw err;
        console.log(student);
        console.log(newClass);
    });
    req.flash('successs', 'class added');
    res.redirect('/students/classes');
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect('/');
}
  
module.exports = router;
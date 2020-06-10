var express = require('express');
var router = express.Router();

var Class = require('../models/class');
var Teacher = require('../models/teacher');


router.get('/classes', ensureAuthenticated, function(req, res){
    // Teacher.getTeacherByUsername([req.user.username], function(err, teacher){
    //     if (err) {
    //         console.log(err);
    //         res.send(err);
    //     } else {
            res.render('teachers/classes', {layout: false} );
    //     }
    // });
});

router.post('/classes/register', ensureAuthenticated, function(req, res, next) {
    var teacher_username = req.user.teacher_username;
    console.log(teacher_username);
    var class_id = req.body.class_id;
    console.log(class_id);
    var class_title = req.body.class_title;
    console.log(class_title);

    var newClass = [{
        teacher_username: teacher_username,
        class_id: class_id,
        class_title: class_title
    }];

    Teacher.saveNewClass(newClass, function(err, teacher){
        if(err) throw err;
        console.log(teacher);
        console.log(newClass);
    });
    req.flash('successs', 'class added');
    res.redirect('teachers/classes');
});

router.get('/classes/:id/lessons/new', ensureAuthenticated, function(req, res){
    res.render('teachers/newlesson', {'class_id': req.params.id, layout: false} );
});

router.post('/classes/:id/lessons/new', ensureAuthenticated, function(req, res){
    var newlesson = []
    newlesson.class_id = req.params.id;
    newlesson.lesson_number = req.body.lesson_number;
    newlesson.lesson_title = req.body.lesson_title;
    newlesson.lesson_body = req.body.lesson_body;

    Class.addLesson(newlesson, function(err, lesson){
        console.log('Lesson Added');
    });
    req.flash('success', 'lesson added');
    res.redirect('/teachers/classes');
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect('/');
}
  
module.exports = router;
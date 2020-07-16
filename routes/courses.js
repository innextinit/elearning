var express = require('express');
var router = express.Router();

const Course = require('../models/course'); // we importing the Course model so we can exproted models

// get all courses
router.get('/', function(req, res) {
  Course.getCourses(function(err, foundcourses){
    if(err){
      console.log(err);
      res.send(err);
    } else {
      res.render('courses/index', { courses: foundcourses, layout: false });
    }
  }, 15); // the 5 here is the limit which is optional
});

// add a new lesson to a course
router.get('/:id/lessons/new', ensureAuthenticated, function(req, res){
  res.render('teachers/newlesson', {'course_id': req.params.id, layout: false} );
});

// add a new lesson to a course
router.post('/courses/:id/lessons/new', ensureAuthenticated, function(req, res){
  var newlesson = {}
  newlesson.course_id = req.params.id;
  newlesson.lesson_number = req.body.lesson_number;
  newlesson.lesson_title = req.body.lesson_title;
  newlesson.lesson_body = req.body.lesson_body;

  Course.addLesson(newlesson, function(err, lesson){
      console.log('Lesson Added');
  });
  req.flash('success', 'lesson added');
  res.redirect('/teachers/courses');
});

// get the details of just a course
router.get('/:id/details', ensureAuthenticated, function(req, res) {
  Course.getCourseById(req.params.id, function(err, onecourse){
    if(err){
      console.log(err);
      res.send(err);
    } else {
      res.render('courses/details', { 'course': onecourse, layout: false });
    }
  });
});

// get all lesson in a course
router.get('/:id/lessons', ensureAuthenticated, function(req, res) {
  Course.getCourseById(req.params.id, function(err, alllessons){
    if(err){
      console.log(err); 
      res.send(err);
    } else {
      res.render('courses/lessons', { 'course': alllessons, layout: false });
    }
  });
});

// get a lesson 
router.get('/:id/lessons/:lesson_id', ensureAuthenticated, function(req, res) {
  Course.getCourseById(req.params.id, function(err, onelesson){ 
    var lesson;
    if(err){
      console.log(err); 
      res.send(err);
    } else {
      for(i=0;i<onelesson.lessons.lenght;i++){
        if (onelesson.lessons[i].lesson_number == req.params.lesson_id){
          lesson = onelesson.lessons[i];
        }
      }
      res.render('courses/lessons', {'course': onelesson, 'lesson': lesson, layout: false});
    }
  });
});

function ensureAuthenticated(req, res, next){ 
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect('/users/login');
}

module.exports = router;
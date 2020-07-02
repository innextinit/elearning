var express = require('express');
var router = express.Router();

const Class = require('../models/class'); // we importing the Class model so we can exproted models

// get all classes
router.get('/', function(req, res) {
  Class.getClasses(function(err, foundclasses){
    if(err){
      console.log(err);
      res.send(err);
    } else {
      res.render('classes/index', { classes: foundclasses, layout: false });
    }
  }, 15); // the 5 here is the limit which is optional
});

// get the details of just a class
router.get('/:id/details', ensureAuthenticated, function(req, res) {
  Class.getClassById(req.params.id, function(err, oneclass){
    if(err){
      console.log(err);
      res.send(err);
    } else {
      res.render('classes/details', { 'class': oneclass, layout: false });
    }
  });
});

// 
router.get('/:id/lessons', ensureAuthenticated, function(req, res) {
  Class.getClassById(req.params.id, function(err, alllessons){
    if(err){
      console.log(err); 
      res.send(err);
    } else {
      res.render('classes/lessons', { 'class': alllessons, layout: false });
    }
  });
});

router.get('/:id/lessons/:lesson_id', ensureAuthenticated, function(req, res) {
  Class.getClassById(req.params.id, function(err, onelesson){ 
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
      res.render('classes/lessons', {'class': onelesson, 'lesson': lesson, layout: false});
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
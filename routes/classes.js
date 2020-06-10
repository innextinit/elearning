var express = require('express');
var router = express.Router();

const Class = require('../models/class'); // we importing the Class model so we can exproted models

router.get('/', function(req, res) {
  Class.getClasses(function(err, foundclasses){
    if(err){
      console.log(err);
      res.send(err);
    } else {
      res.render('classes/index', { classes: foundclasses, layout: false });
    }
  }, 5); // the 5 here is the limit which is optional
});


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
      // for(i=0; i<onelesson.lessons[1].lenght;1++){
      //   if (onelesson.lessons[1] == req.params.lesson_id) {
      //     lesson = onelesson.lessons[1];
      //   }
      // }
      res.render('classes/lessons', {'class': onelesson, 'lesson': lesson, layout: false});
    }
  });
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect('/');
}

module.exports = router;
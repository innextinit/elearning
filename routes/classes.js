var express = require('express');
var router = express.Router();

const Class = require('../models/class'); // we importing the Class model so we can exproted models

router.get('/', function(req, res) {
  Class.getClasses(function(err, foundclasses){
    if(err){
      console.log(err);
      res.send(err);
    } else {
      res.render('classes/index', { classes: foundclasses });
    }
    console.log(foundclasses)
  }, 5); // the 5 here is the limit which is optional
});


router.get('/:id/details', function(req, res) {
  Class.getClassById([req.param.id], function(err, oneclass){
    if(err){
      console.log(err);
      res.send(err);
    } else {
      res.render('classes/details', { 'class': oneclass });
    }
  });
});


module.exports = router;
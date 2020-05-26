var express = require('express');
var router = express.Router();

Class = require('../models/class'); // we importing the Class model so we can exproted models

router.get('/', function(req, res, next) {
  Class.getClasses(function(err, classes){
    if(err){
      console.log(err);
      res.send(err);
    } else {
      res.render('index', { 'classes': classes });
    }
  }, 5); // the 5 here is the limit which is optional
});

module.exports = router;

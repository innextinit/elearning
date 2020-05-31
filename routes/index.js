var express = require('express');
var router = express.Router();

var Class = require('../models/class');
var User = require('../models/user');
var Student = require('../models/student');
var Teacher = require('../models/teacher');

router.get('/', function(req, res) {
      res.render('layouts/layout');
});

// Classes

router.get('/classes', function(req, res) {
      Class.getClasses(function(err, foundclasses){
        if(err){
          console.log(err);
          res.send(err);
        } else {
          res.render('classes/index', { classes: foundclasses.map(fc => fc.toJSON()), layout: false}); // this ".map(fc => fc.toJSON()" is telling it to map the foundclasses into a JSON object so it would be able to get those object we useing.
        }                                                                                              // the layout: false is telling it not to use the default template here
      }, 5); // the 5 here is the limit which is optional
    });
    
    
    router.get('/classes/:id/details', function(req, res) {
      Class.getClassById([req.params.id], function(err, oneclass){
        if(err){
          console.log(err);
          res.send(err);
        } else {
          res.render('classes/details', { oneclass: oneclass, layout: false});
          console.log(req.params.id);
          console.log(oneclass);
          console.log(oneclass.title);
          console.log(oneclass.teacher);
          console.log(oneclass.lessons.lesson_title);
        }
      });
    });


    // users

    router.get('/users/register', function(req, res, next) {
      res.render('users/register');
    });
    
    router.post('/users/register', function(req, res, next){
      var name = req.body.name;
      var email = req.body.email;
      var username = req.body.username;
      var password = req.body.password;
      var password2 = req.body.password2;
      var ipAddress = req.connection.address();
      var profileImage = req.file.data;
      var street_address = req.body.street_address;
      var city = req.body.city;
      var state = req.body.state;
      var zip = req.body.zip;
      var type = req.body.type;
    });
    
    router.get('/users/login', function(req, res, next) {
      res.render('users/login');
    });
    
    router.post('/users/login', function(req, res, next) {
          res.send('login POST');
      var username = req.body.username;
      var password = req.body.password;
    });

    // students

    router.get('/students/classes/register', function(req, res, next){
          res.send('student classes registeration');
    });

    router.post('/students/classes/register', function(req, res, next){
      res.send('student POST classes registeration');
    });

    router.get('/*', function(req, res, next) {
      res.send("page not found");
    });

module.exports = router;

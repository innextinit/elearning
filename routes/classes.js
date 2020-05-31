// var express = require('express');
// var router = express.Router();

// const Class = require('../models/class'); // we importing the Class model so we can exproted models

// router.get('/', function(req, res) {
//   Class.getClasses(function(err, foundclasses){
//     if(err){
//       console.log(err);
//       res.send(err);
//     } else {
//       res.render('classes/index', { classes: foundclasses.map(fc => fc.toJSON()), layout: false}); // this ".map(fc => fc.toJSON()" is telling it to map the foundclasses into a JSON object so it would be able to get those object we useing.
//     }                                                                                              // the layout: false is telling it not to use the default template here
//   }, 5); // the 5 here is the limit which is optional
// });


// router.get('/:id/details', function(req, res) {
//   Class.getClassById([req.params.id], function(err, oneclass){
//     if(err){
//       console.log(err);
//       res.send(err);
//     } else {
//       res.render('classes/details', { oneclass: oneclass, layout: false});
//       console.log(req.params.id);
//       console.log(oneclass);
//       console.log(oneclass.title);
//       console.log(oneclass.teacher);
//       console.log(oneclass.lessons.lesson_title);
//     }
//   });
// });

// router.get('/*', function(req, res, next) {
//   res.send("page not found");
// });

// module.exports = router;
var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator/check');

var Message = require('../models/message');

router.get('/contact', ensureAuthenticated, function(req, res) {
    res.render('contact', {layout: false});
});
router.post('/contact', ensureAuthenticated, function(req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var subject = req.body.subject;
    var message = req.body.message;
    var username = req.body.username;

// form validation
  check('firstname', 'character allowed is a-z,A-Z')
  .not()
  .isEmpty()
  .matches(/[^a-zA-Z]/g);

  check('lastname', 'character allowed is a-z,A-Z')
  .not()
  .isEmpty()
  .matches(/[^a-zA-Z]/g);

  check('email', 'min character 8')
    .not()
    .isEmpty()
    .isLength({
      min: 8
    });

  check('email', 'Email not valid').isEmail().normalizeEmail().custom((value, {req}) => {
    return new Promise((resolve, reject) => {
      // dns check email
      dns_validate_email.validEmail(value, (valid) => {
        console.log(`valid: ${vali}`);
        if (valid) {
          resolve(value);
        } else {
          reject(new Error('not a valid email'));
        }
      });
    });
  });

  check('subject', 'character allowed is a-z,A-Z')
  .not()
  .isEmpty()
  .isLength({
      max: 50
  })
  .matches(/[^a-zA-Z]/g);

// check for errors during the validation
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.render('register').json({
        errors: errors.array(),
        // to return all input value back to the user if there was error during filling
        firstname: firstname,
        lastname: lastname,
        email: email,
        subject: subject,
        message: message
      });
    } else {
        var newMessage = new Message({
            firstname: firstname,
            lastname: lastname,
            email: email,
            subject: subject,
            message: message,
            username: username
        });
        Message.saveNewMessage(newMessage, function(err, message){
            console.log('Thanks for getting back to US');
            console.log(newMessage);
        });
    }

    req.flash()

})

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect('/');
  };

module.exports = router;

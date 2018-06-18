var express = require('express');
var router = express.Router();
var gravatar = require('gravatar');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var keys = require('../../config/keys');
var passport = require('passport');


// Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');


// Load the User Model
var User = require('../../models/User');

// @route GET api/users/test
// @desc Tests users route
// @access Public
router.get('/test', (req, res) => res.json({msg: "Users works"}));

// @route POST api/users/register
// @desc Register user
// @access Public
router.post('/register', (req, res) => {

  const {errors, isValid} = validateRegisterInput(req.body);

  // Check Validation
  if(!isValid){
    return res.status(400).json(errors);
  }

  User.findOne({
    email: req.body.email
  })
    .then(user => {
      if(user){
        errors.email = 'Email already exists';
        return res.status(400).json(errors);
      }
      else{
        var avatar = gravatar.url(req.body.email, {
          s: '200', // Size
          r: 'pg',  // Rating
          d: 'mm'  // Default
        });

        var newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar: avatar,
          password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err))
          })
        })
      }
    })
});


// @route GET api/users/login
// @desc Login user / Returning JWT Token
// @access Public
router.post('/login', (req, res) => {

  const {errors, isValid} = validateLoginInput(req.body);

  // Check Validation
  if(!isValid){
    return res.status(400).json(errors);
  }

  var email = req.body.email;
  var password = req.body.password;

  User.findOne({email})
    .then(user => {
      if(!user){
        errors.email = 'User not found';
        return res.status(404).json(errors);
      }

      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if(isMatch){
            // User Matched
            const payload = {id: user.id, name: user.name, avatar: user.avatar};

            // Sign Token
            jwt.sign(
              payload,
              keys.secretOrKey,
              { expiresIn: 3600 },
              (err, token) => {
                res.json({
                  success: true,
                  token: 'Bearer ' + token
                });
              }
            );
          }else{
            errors.password = 'Password incorrect';
            return res.status(400).json(errors);
          }
        })
    });
});


// @route GET api/users/current
// @desc Return current user
// @access Private
router.get('/current', passport.authenticate('jwt', {session: false}),
  (req, res) => {
    // res.json(req.user);
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  });

module.exports = router;
var express = require('express');
var router = express.Router();
var gravatar = require('gravatar');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var keys = require('../../config/keys');
var passport = require('passport');
const nodemailer = require('nodemailer');
const emailConfirm = require('../../config/keys').emailConfirm;
const passwordConfirm = require('../../config/keys').passwordConfirm;


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
var rand,mailOptions,host,link;  // Initialized the variables
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
        
        // Send a email to verify
        nodemailer.createTestAccount((err, account) => {
          // create reusable transporter object using the default SMTP transport
          let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: emailConfirm,
              pass: passwordConfirm
            }
          });

          // setup email data with unicode symbols
          //rand=Math.floor((Math.random() * 100) + 54);
          rand = newUser.email;
          host=req.get('host');

          link="http://"+req.get('host')+"/api/users/verify?id="+rand;
          console.log("Link is: ", link);
          console.log("Host is: ", host);

          //var url = `http://localhost:3000/confirmation/${newUser.email}`;
          mailOptions = {
            from: emailConfirm, // sender address
            to: newUser.email, // list of receivers
            subject: 'Thanks for registration!', // Subject line
            text: 'Please confirm your email identification', // plain text body
            html: `Please click this email to confirm your email: <a href="${link}">${link}</a>` // html body
          };

          console.log("From address: ", mailOptions.from);
          console.log("To address: ", mailOptions.to);
          // send mail with defined transport object
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
          });
        });
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

      // Check whether the user has checked the link or not
      if(!user.confirm){
        errors.confirm = "Please confirm your email before login";
        return res.status(400).json(errors);
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



// Check for the click on the verification link
router.get('/verify',function(req,res){
  console.log(req.protocol+":/"+req.get('host'));
  //if((req.protocol+"://"+req.get('host'))==("http://"+host))
  //{
    console.log("Domain is matched. Information is from Authentic email");
    if(req.query.id==rand)
    {
      console.log("email is verified");
      //res.end("<h1>Email "+mailOptions.to+" is been Successfully verified");
      //res.end("<h1>Email "+mailOptions.to+" is been Successfully verified");
      User.findOne({email: mailOptions.to})
        .then(user => {
          console.log(user);
          console.log("User found in the database");
          User.findOneAndUpdate(
            {email: mailOptions.to},
            { $set: {confirm: true}},
            {new: true}
          )
            .then(
              res.end("<h1>Email "+mailOptions.to+" is been Successfully verified")
            );
        })
        .catch(err => res.status(400).json({invalid: "The link you clicked in invalid"}))
    }
    else
    {
      console.log("email is not verified");
      res.end("<h1>Bad Request</h1>");
    }
  //}
  // else
  // {
  //   res.end("<h1>Request is from unknown source");
  // }
});


router.put('/confirmed', function(req, res){
  console.log("I am in the confirmed request of : ", req);
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


// Google login
// router.post('/registerGoogle', (req, res) => {
//
//   //const {errors, isValid} = validateRegisterInput(req.body);
//
//   // Check Validation
//   // if(!isValid){
//   //   return res.status(400).json(errors);
//   // }
//
//   User.findOne({
//     email: req.body.email,
//     confirm: req.body.confirm
//   })
//     .then(user => {
//       if(user){
//         errors.email = 'Email already exists';
//         return res.status(400).json(errors);
//       }
//       else{
//         var avatar = gravatar.url(req.body.email, {
//           s: '200', // Size
//           r: 'pg',  // Rating
//           d: 'mm'  // Default
//         });
//
//         var newUser = new User({
//           name: req.body.name,
//           email: req.body.email,
//           avatar: avatar,
//           password: req.body.password,
//           confirm: true
//         });
//
//         bcrypt.genSalt(10, (err, salt) => {
//           bcrypt.hash(newUser.password, salt, (err, hash) => {
//             if(err) throw err;
//             newUser.password = hash;
//             newUser
//               .save()
//               .then(user => res.json(user))
//               .catch(err => console.log(err))
//           })
//         })
//       }
//     })
// });


// Google signin Registeration
router.post('/registerGoogle', (req, res) => {

  User.findOne({
    email: req.body.email
  })
    .then(user => {
      if(user){
        const payload = {id: user.id, name: user.name, avatar: user.avatar, confirm: user.confirm};

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
          password: "123456789",
          confirm: true
        });

        console.log(newUser);
        newUser
          .save()
          .then(user => res.json(user))
          .catch(err => console.log("Error is: ", err))

      }
    })
    .catch(err => console.log(err))
});



router.post('/loginGoogle', (req, res) => {

  var email = req.body.email;
  var password = "123456789";
  var tok = req.body.token;

  User.findOne({email})
    .then(user => {
      if(!user){
        errors.email = 'User not found';
        return res.status(404).json(errors);
      }

      console.log(req.body);
      console.log('Token is', tok.token);
      const payload = {id: user.id, name: user.name, avatar: user.avatar};

      console.log("LoginGoogle payload: ", payload);
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

    })
    .catch(err => console.log(err));
});


module.exports = router;
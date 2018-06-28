// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// var keys = require('../../config/keys');
// var passport = require('passport');
// const mongoose = require('mongoose');
// const User = mongoose.model('usersg');
// var jwt = require('jsonwebtoken');
// var Users = require('../../models/User');
//
//
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });
//
// passport.deserializeUser((id, done) => {
//   User.findById(id)
//     .then(user => {
//       done(null, user);
//     });
// });
//
// // Google authentication
// passport.use(new GoogleStrategy({
//     clientID: keys.googleClientID,
//     clientSecret: keys.googleClientSecret,
//     callbackURL: '/api/authgoogle/callback',
//     //callbackURL: '/dashboard',
//     proxy: true
//   },
//   (accessToken, refreshToken, profile, done) => {
//     let data = profile._json;
//     //console.log(data);
//     console.log(data.displayName);
//     console.log(data.emails[0].value);
//     console.log(data.image.url);
//       User.findOne({ googleId: profile.id })
//         .then((existingUser) => {
//           if(existingUser){
//             // We have a user record
//             done(null, existingUser);
//           } else {
//             // This is a new user
//             new User({googleId: profile.id})
//               .save()
//               .then(user => done(null, user));
//
//             var email = data.emails[0].value;
//             var name = data.displayName;
//             var avatar = data.image.url;
//
//             var newUser = new Users({
//               name: name,
//               email: email,
//               avatar: avatar,
//               password: profile.id
//             })
//
//             newUser
//               .save()
//               .then(user => res.json(user))
//               .catch(err => console.log(err))
//           }
//           // login page logic
//           // errors.email = 'User not found';
//           // return res.status(404).json(errors);
//
//         })
//   })
// );
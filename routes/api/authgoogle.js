//
// var passport = require('passport');
//
// module.exports = app => {
//   app.get('/api/authgoogle',
//     passport.authenticate('google', {
//       scope: ['profile', 'email']
//     })
//   );
//
//   // app.get('/api/authgoogle/callback',
//   //   passport.authenticate('google'),
//   //   (req, res) => {
//   //     // axios
//   //     //   .get('/api/profile/all')
//   //     //   .then(res =>
//   //     //     dispatch({
//   //     //       type: GET_PROFILES,
//   //     //       payload: res.data
//   //     //     })
//   //     //   )
//   //     res.redirect('/api/profile/all');
//   //     //console.log(req);
//   //     //console.log(res);
//   //     //res.redirect('/api/profile/all');
//   //     //res.render("/profiles");
//   //     //res.render(<h1>Can you see me?</h1>);
//   //   }
//   // );
//
//   app.get('/api/logout', (req, res) => {
//     req.logout();
//     res.send(req.user);
//   });
//
//   app.get('/api/current_user', (req, res) => {
//     res.send(req.user);
//   });
// };
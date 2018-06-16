var express = require('express');
var mongoose = require('mongoose');
const app = express();
const db = require('./config/keys').mongoURI;
var bodyParser = require('body-parser');
var passport = require('passport');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

//Body Parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false}));
// parse application/json
app.use(bodyParser.json());


// Connect to MongoDb
mongoose
  .connect(db)
  .then(() => console.log('MongoDb Connected'))
  .catch(err => console.log(err));


// Passport Middleware
app.use(passport.initialize());


// Passport Config
require('./config/passport')(passport);

// Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, function(){
  console.log('App listening to port 5000');
});

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  googleId: String
});

module.exports = UserG = mongoose.model('usersg', UserSchema);
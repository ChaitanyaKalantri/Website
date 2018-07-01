var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: String,
    default: Date.now
  },
  confirm: {
    type: Boolean,
    default:false
  }

});

module.exports = User = mongoose.model('users', UserSchema);
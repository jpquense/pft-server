'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
},
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {type: String, required: true, default: ''},
  lastName: {type: String, required: true, default: ''}
});

UserSchema.methods.serialize = function() {
  return {
    email: this.email || '',
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || ''
  };
};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema);

module.exports = { User };

'use strict';

const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config');
const router = express.Router();
const disableWithToken = require('../middleware/disableWithToken').disableWithToken;
const requiredFields = require('../middleware/requiredFields');

const createAuthToken = user => {
  return jwt.sign({
    user: {
      _id: user._id,
      lastName: user.lastName,
      username: user.username,
      firstName: user.firstName,
      email: user.email,
    }
  }, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

const localAuth = passport.authenticate('local', { session: false });

// Get jwt token at login in exhange for username and password using local authentication
router.post('/login', disableWithToken, requiredFields('email', 'password'), localAuth, (req,res) => {
  console.log('login endpoint reached')
  const authToken = createAuthToken(req.user);
  res.json({authToken});
});

const jwtAuth = passport.authenticate('jwt', {session: false});

router.get('/protected', jwtAuth, (req, res) => {
  res.status(200).json({status: 'ok!'});
});

router.post('/refresh', jwtAuth, (req,res) => {
  const authToken = createAuthToken(req.user);
  res.json({authToken});
});

module.exports = { router };
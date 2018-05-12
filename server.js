'use strict';

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const passport = require('passport');

const { PORT, DATABASE_URL } = require('./config');

const { Goal } = require('./goals/models');
const { User } = require('./users/models');

const {router: usersRouter} = require('./users/router');
const {router: goalsRouter} = require('./goals/router');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

const app = express();

mongoose.Promise = global.Promise;

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
});

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Logging
app.use(morgan('common'));

// Static Files
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

// Authentication strategies
passport.use(localStrategy);
passport.use(jwtStrategy);

// Routes
app.use('/api', goalsRouter);
app.use('/api', usersRouter);
app.use('/api', authRouter);
// if endpoint does not exist
app.use('*', function (req, res) {
    res.status(404).json({ message: 'Not Found' });
});

// Run and close Server
let server;

function runServer(databaseUrl = DATABASE_URL, port) {

  return new Promise ((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port = (process.env.PORT || 8080), () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise(function(resolve, reject) {
      console.log(`Closing server`);
      server.close(err => {
        if(err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if(require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
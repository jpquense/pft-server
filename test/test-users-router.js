'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = require('chai').should();
const expect = chai.expect;
const mongoose = require('mongoose');
const faker = require('faker');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const { Goal } = require('../goals/models')
const { User } = require('../users/models')
const { app , runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL, JWT_SECRET } = require('../config.js');
const { sendAllDataToDb, createTestUser, createTestUserAndGoal, generateUserData, generateGoalData, tearDownDb } = require('./test-functions-goals')

chai.use(chaiHttp);

let testUserData;
let testUser;

describe('/api/users API Resource', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return new Promise(resolve => {
      createTestUser()
      .then(user => {
        testUser = user;
        return sendAllDataToDb(testUser)
      })
      .then(() => resolve())
      .catch(err => console.log(err))
    });
  });
  
  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  describe('POST request to /api/users', function() {
    it('should create a new user in the database', function() {
      let newUser = {
        firstName: faker.name.firstName(),
        lastName: faker.name.firstName(),
        username: faker.name.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password()
      };
      return chai.request(app)
        .post('/api/users')
        .send(newUser)
        .then(function(res) {
          res.should.have.status(201);
          res.should.be.json;
        });
      });
    });
});
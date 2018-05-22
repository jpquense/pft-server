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

let testUser;

describe('api/goals API Resource', function() {
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

  describe('GET request to /goals', function() {
    it('should list all existing goals', function() {
      const token = jwt.sign({user: {_id: testUser._id}}, JWT_SECRET, {expiresIn: 10000});
      let res;
      return chai.request(app)
      .get('/api/goals')
      .set('Authorization', `Bearer ${token}`)
      .then(function(_res) {
        res = _res;
        res.should.have.status(200);
        res.should.be.json;
        expect(res.body).to.be.an('array');
      })
    });
  });

  describe('Post request to /goals', function() {
    it('should add a goal', function() {
      const token = jwt.sign({user: {_id: testUser._id}}, JWT_SECRET, {expiresIn: 10000});
      const newGoal = generateGoalData();
      return chai.request(app)
        .post('/api/goals')
        .set('Authorization', `Bearer ${token}`)
        .send(newGoal)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body.text).to.deep.equal(newGoal.text);
          expect(res.body.count).to.deep.equal(newGoal.count);
          expect(res.body.done).to.deep.equal(newGoal.done);
      });
    });
  });

  describe('PUT request to /goals', function() {
    it('should update goal', function() {
      const updateGoal = {
        text: faker.lorem.sentence()
      };
      const token = jwt.sign({user: {_id: testUser._id}}, JWT_SECRET, {expiresIn: 10000});
      return Goal
        .findOne()
        .then(result => {
          updateGoal._id = result._id;
          return chai.request(app)
          .put(`/api/goals/${result._id}`)
          .set('Authorization', `Bearer ${token}`)
          .send(updateGoal)
        })
        .then(res => {
          res.should.have.status(200);
          res.should.be.an("object");
          return Goal.findById(updateGoal._id);
        })
        .then(goal => {
          goal.text.should.deep.equal(updateGoal.text);
        });
      });
    });

  describe('DELETE endpoint', function() {
    it('should delete a goal by id', function() {
      let deletedGoal;
      const token = jwt.sign({user: {_id: testUser._id}}, JWT_SECRET, {expiresIn: 10000});
      return Goal
        .findOne()
        .then(_goal => {
          deletedGoal = _goal._id;
          return chai.request(app)
            .delete(`/api/goals/${deletedGoal}`)
            .set('Authorization', `Bearer ${token}`)
        })
        .then(res => {
          res.should.have.status(200);
          return Goal.findById(deletedGoal);
        })
        .then(goal => {
          should.not.exist(goal);
        });
      });
    });
});
'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const requiredFields = require('../middleware/requiredFields');

mongoose.Promise = global.Promise;

const { Goal } = require('./models');

const jwtAuth = passport.authenticate('jwt', {session: false});

// Create API group routes
// Get all goals for one user
router.get('/goals', jwtAuth, (req, res) => {
    Goal
    .find({author: req.user._id})
    .sort({count: 'desc'})
    .then(goals => res.json(goals))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
  });
 // Get one goal with _id 
router.get('/goals/:id', jwtAuth, (req, res) => {
  Goal
    .findById(req.params.id)
    .then(goal => res.json(goal))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Unable to find goal, contact Internal server manager' });
    });
});
// Create new goal
router.post('/goals', jwtAuth, requiredFields('text', 'count'), (req, res) => {
  Goal
    .create({
      text: req.body.text,
      count: req.body.count,
      done: req.body.done,
      author: req.user._id 
    })
    .then(goal => res.status(201).json(goal))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error, unable to post new goal' });
    });
});
// Change existing goal with _id
router.put('/goals/:id', jwtAuth, (req, res) => {
  Goal
  .findByIdAndUpdate(req.params.id, {$set: { text: `${req.body.text}`}})
  .then(updatedGoal => res.json(updatedGoal))
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});
// Delete existing goal with _id
router.delete('/goals/:id', jwtAuth, (req, res) => {
  Goal
    .findByIdAndRemove(req.params.id)
    .then(goal => {
      console.log(`Deleted goal with id \`${req.params.id}\``);
      res.status(204).json({ message: 'success' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error, unable to delete gratitude' });
    });
});

module.exports = { router };
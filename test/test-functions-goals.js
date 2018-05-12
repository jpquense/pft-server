const faker = require('faker');
const mongoose = require('mongoose');

const { Goal } = require('../goals/models')
const { User } = require('../users/models')

function sendAllDataToDb(user) {
  console.info('Sending data to database...');
  const testData = [];
  for (let i=1; i<=2; i++) {
    testData.push(generateGoalData(user._id));
  }
  return Goal.insertMany(testData);
}

function generateGoalData(userId) {
  console.log(`Generating goal data...`);
  return {
    text: faker.lorem.sentence(),
    done: faker.random.boolean(),
    count: faker.random.number(),
    author: userId
  }
}

function generateUserData() {
  console.log(`Generating user data...`);
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    username: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password()
  }
}

function createTestUser() {
  return User.create(generateUserData());
}

function createTestUserAndGoal(i) {
  return User.create(generateUserData())
    .then(user => {
      let userId = user._id;
      let email = user.email;
      const data = [];
      for(let x = 0; x <= 1; x++) {
        let newGoal = generateGoalData();
        newGoal.author = userId;
        data.push(Goal.create(newGoal));
      }
      console.log(`Generated goals`);
      return Promise.all(data);
    })
}

function tearDownDb() {
  return new Promise ((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

module.exports = { sendAllDataToDb, generateGoalData, generateUserData, createTestUser, tearDownDb }
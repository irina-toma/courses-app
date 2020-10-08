require('dotenv').config();

const mongoose = require('mongoose');

(async () => {
  try {
    await mongoose.connect(`mongodb://${process.env.MHOST}:${process.env.MPORT}/${process.env.MDATABASE}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  } catch (e) {
    console.trace(e);
  }
})();

const Course = require('./Course.js');
const User = require('./User.js');
const UsersCourses = require('./UserCourse.js');
const Message = require('./Message.js');
const pool = require('./pool.js');


module.exports = {
  Course,
  User,
  UsersCourses,
  Message,
  pool
}
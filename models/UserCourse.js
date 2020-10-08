const pool = require("./pool.js");
const utils = require("../controllers/utils/utils.js");
const {
  ServerError
} = require("../controllers/utils/errors.js");

class UsersCourses {
  constructor(userId, courseId) {
    this.userId = userId;
    this.courseId = courseId;
  }

  async save() {
    const stm = {
      text: 'INSERT INTO users_courses("userId", "courseId") VALUES($1, $2)',
      values: [this.userId, this.courseId],
    };

    let result = await pool.query(stm);

    return result;
  }
}

module.exports = UsersCourses;
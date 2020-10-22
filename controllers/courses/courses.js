const { Course, pool, User, UsersCourses } = require("../../models");

const { authorizeAndExtractToken, decodeToken } = require("../security/jwt.js");
const { authorizeRoles } = require("../security/roles.js");

const utils = require("../utils/utils.js");

const express = require("express");
const jwt = require("../security/jwt.js");
const router = express.Router();

// get all courses
router.get("/", async (req, resp, next) => {
  let courseId = req.query.id;

  try {
    let courses = await Course.find();
    let selectedCourse = courses[0];

    let domains = {};

    for (let i = 0; i < courses.length; i++) {
      if (courseId && courses[i]._id === courseId) {
        selectedCourse = courses[i];
      }
      let courseType = courses[i].course_type;

      if (domains[courseType]) {
        domains[courseType].push(courses[i]);
      } else {
        domains[courseType] = [courses[i]];
      }
    }

    resp.render("courses", {
      domains,
      selectedCourse,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, resp, next) => {
  const newCourse = new Course(req.body);

  try {
    let result = await newCourse.save();
    resp.json(result);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get("/apply", async (req, resp, next) => {
  let id = req.query.id;

  if (!id) {
    console.log("error");
    next("error finding course");
  }

  console.log(id);
  let course = await Course.findById(id);

  if (!course) {
    console.log("error finding course");
    next("error finding course");
  }

  let user;

  try {
    const decoded = await decodeToken(req);

    const userList = await pool.query(
      "SELECT * FROM public.users WHERE id = " + decoded.userId
    );

    user = userList.rows[0];
  } catch (err) {
    user = {};
  }

  //set course id as cookie
  resp.cookie("courseId", id);

  resp.render("apply-form", { course, user });
});

router.post("/submit", async (req, resp) => {
  let courseId = req.cookies["courseId"];
  if (!courseId) {
    resp.send(utils.error({ url: "/" }));
  }

  //TODO: add in database
  let tempDetails = req.body;
  let userId;

  try {
    const decoded = await decodeToken(req);
    userId = decoded.userId;
  } catch (err) {
    let newTempUser = new User(
      tempDetails.name,
      tempDetails.email,
      "temp",
      "temp" + tempDetails.email,
      "tempRole",
      false
    );

    await newTempUser.save();

    // get id of newly created entry
    tempUser = await User.findByEmail(tempDetails.email);
    userId = tempUser.id;

    //add address to this user
    await tempUser.addUserDetails(tempDetails.address);
  }

  let usercourse = new UsersCourses(userId, courseId);
  usercourse.save();

  //since we created a user account, send the token cookie to the ui to know who is this user
  resp.cookie(
    "token",
    jwt.generateToken({
      userId: tempUser.id,
      userRole: tempUser.role,
    })
  );

  resp.send(utils.success({ url: "/" }));
});

router.get("/:id", async (req, resp, next) => {
  try {
    let course = await Course.findById(req.params.id);
    resp.json(course);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

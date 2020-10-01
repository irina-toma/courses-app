const { Course, pool } = require("../../models");

const { authorizeAndExtractToken, decodeToken } = require("../security/jwt.js");
const { authorizeRoles } = require("../security/roles.js");

const express = require("express");
const router = express.Router();

// get all courses
router.get("/", async (req, resp, next) => {
  let courseId = req.query.id;

  try {
    let courses = await Course.find();
    let selectedCourse = courses[0];

    let domains = {};

    for (let i = 0; i < courses.length; i++) {
      if (courseId && courses[i]._id == courseId) {
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

router.get("/:id", async (req, resp, next) => {
  try {
    let course = await Course.findById(req.params.id);
    resp.json(course);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, resp, next) => {
  //TODO: validations
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

  const decoded = await decodeToken();

  const userList = await pool.query(
    "SELECT * FROM public.users WHERE id = " + decoded.userId
  );

  const user = userList.rows[0];

  resp.render("apply-form", { course, user });
});

module.exports = router;

const {
    Course
} = require('../../models');

const {
    authorizeAndExtractToken
} = require('../security/jwt.js');
const {
    authorizeRoles
} = require('../security/roles.js');

const express = require('express');
const router = express.Router();



// get all courses
router.get('/', async (req, resp, next) => {
    const limit = req.query.limit;

    try {
        let courses = await Course.find();

        let domains = {};

        for (let i = 0; i < courses.length; i++) {

            let courseType = courses[i].course_type;

            if (domains[courseType]) {
                domains[courseType].push(courses[i]);
            } else {
                domains[courseType] = [courses[i]];
            }
        }

        resp.render('courses', {
            domains
        });
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, resp, next) => {
    try {
        let course = await Course.findById(req.params.id);
        resp.json(course);
    } catch (err) {
        next(err);
    }

});

router.post('/', async (req, resp, next) => {
    //TODO: validations
    const newCourse = new Course(req.body);

    try {
        let result = await newCourse.save();
        resp.json(result)
    } catch (err) {
        console.log(err);
        next(err);
    }
});

module.exports = router;
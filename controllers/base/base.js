const { authorizeAndExtractToken } = require('../security/jwt.js');
const { authorizeRoles } = require('../security/roles.js');

const express = require('express');
const router = express.Router();

const { Course } = require('../../models');

router.get('/', async (req, resp) => {
    // get courses from mongodb
    let courses = await Course.find().limit(3);

    resp.render('index', {
        courses: courses, 
        description: "These are my awesome courses"
    });
});



module.exports = router;

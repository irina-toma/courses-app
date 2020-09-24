const { authorizeAndExtractToken } = require('../security/jwt.js');
const { authorizeRoles } = require('../security/roles.js');

const express = require('express');
const router = express.Router();

router.get('/', (req, resp) => {
    resp.render('index');
});



module.exports = router;

const express = require('express');
const router = express.Router();
const {
    pool,
    Message
} = require('../../models');
const utils = require('../utils/utils.js');
const {
    authorizeAndExtractToken
} = require('../security/jwt.js');
const {
    authorizeRoles
} = require('../security/roles.js')

router.get("/", async (req, res, next) => {
    let messageList = Message.findAll();
    /*
        try {

        }
    */
    res.render("messages", {
        messageList
    });

})


module.exports = router;
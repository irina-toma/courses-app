const express = require('express');
const router = express.Router();
const {
    pool,
    Message,
    User
} = require('../../models');
const utils = require('../utils/utils.js');
const {
    authorizeAndExtractToken
} = require('../security/jwt.js');
const {
    authorizeRoles
} = require('../security/roles.js')

router.get("/", authorizeAndExtractToken, async (req, resp, next) => {
    let currentId = req.state.decoded.userId;

    let messageList = await Message.findByOwner(currentId);

    console.log(messageList);
    
    resp.render("messages", {
        messageList
    });

});

router.get("/sent", authorizeAndExtractToken, async (req, resp, next) => {
    let currentId = req.state.decoded.userId;

    let messageList = await Message.findByOwnerSent(currentId);
    
    resp.render("messages", {
        messageList
    });

});

router.get("/received", authorizeAndExtractToken, async (req, resp, next) => {
    let currentId = req.state.decoded.userId;

    let messageList = await Message.findByOwnerReceived(currentId);
    
    resp.render("messages", {
        messageList
    });

});

router.post("/", authorizeAndExtractToken, async (req, resp, next) => {
    // luam datele din request
    let params = req.body;
    // title, username, body

    if (!params.title || !params.to || !params.body) {
        next("Missing parameters");
    }

    let currentId = req.state.decoded.userId;

    // validam username
    let user = await User.findByUsername(params.to);
    if (user) {
        let msgSender = new Message(user.id, currentId, currentId, params.body, params.title, null, null);
        let resp = await msgSender.save();

        let msgReceiver = new Message(user.id, currentId, user.id, params.body, params.title, null, null);
        resp = await msgReceiver.save();
    } else {
        next("Wrong username");
    }


});


module.exports = router;
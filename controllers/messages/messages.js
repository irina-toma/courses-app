const express = require("express");
const router = express.Router();
const { pool, Message, User } = require("../../models");
const utils = require("../utils/utils.js");
const { authorizeAndExtractToken } = require("../security/jwt.js");
const { authorizeRoles } = require("../security/roles.js");

router.get("/", authorizeAndExtractToken, async (req, resp, next) => {
  let currentId = req.state.decoded.userId;

  let messageList = await Message.findByOwnerSent(currentId);
  let mailingList = await Message.getMyMailingLists(currentId);

  console.log(mailingList);

  resp.render("messages", {
    messageList,
    mailingList,
  });
});

router.delete("/:id", authorizeAndExtractToken, async (req, resp, next) => {
  let msgId = req.params.id;

  // TODO: implement the commented code
  // let toDelete = new Message(id);
  // toDelete.delete();

  await Message.delete(msgId);
  resp.send(utils.success(msgId));
});

router.get("/sent", authorizeAndExtractToken, async (req, resp, next) => {
  let currentId = req.state.decoded.userId;

  let messageList = await Message.findByOwnerSent(currentId);
  let mailingList = await Message.getMyMailingLists(currentId);

  resp.render("messages", {
    messageList,
    mailingList,
  });
});

router.get("/received", authorizeAndExtractToken, async (req, resp, next) => {
  let currentId = req.state.decoded.userId;

  let messageList = await Message.findByOwnerReceived(currentId);
  let mailingList = await Message.getMyMailingLists(currentId);

  console.log(messageList);

  resp.render("messages", {
    messageList,
    mailingList,
  });
});

router.post("/", authorizeAndExtractToken, async (req, resp, next) => {
  // luam datele din request
  let params = req.body;
  // title, username, body

  let toList = params.toList;

  if (!params.title || !params.toList || !params.body) {
    next("Missing parameters");
  }

  let currentId = req.state.decoded.userId;

  // multiple usernames

  // toList trebuie primit din UI

  for (let user of toList) {
    if (user.group) {
      let mailingListName = user.name;
      // validate group is in mailing list
      let mailingEntryList = await Message.checkInMailingList(mailingListName);
      if (mailingEntryList.length == 0) {
        next("Mailing group does not exist");
      } else {
        //currentUser are in sent un mail de la el catre lista/grup
        let msgReceiver = new Message(
          null,
          currentId,
          currentId,
          params.body,
          params.title,
          null,
          mailingListName
        );
        resp = await msgReceiver.save();

        // trimitem tuturor utilizatorilor din lista
        // toti userii din lista au un mesaj de la currentUser
        for (let entry of mailingEntryList) {
          let to = entry.user_id; // id of user from list

          let msgSender = new Message(
            to,
            currentId,
            to,
            params.body,
            params.title,
            null,
            null
          );
          let resp = await msgSender.save();
        }
      }
    } else {
      // validam username
      let user = await User.findByUsername(params.to);
      if (user) {
        let msgSender = new Message(
          user.id,
          currentId,
          currentId,
          params.body,
          params.title,
          null,
          null
        );
        let resp = await msgSender.save();

        let msgReceiver = new Message(
          user.id,
          currentId,
          user.id,
          params.body,
          params.title,
          null,
          null
        );
        resp = await msgReceiver.save();
      } else {
        next("Wrong username");
      }
    }
  }
});

// router.get("/mailing-list", authorizeAndExtractToken, async (req, resp, next) => {
//     let myId = req.state.decoded.userId;

//     let result = await Message.getMyMailingLists(myId);
//     resp.send(utils.success(result));
// });

router.post(
  "/mailing-list",
  authorizeAndExtractToken,
  authorizeRoles("student"),
  async (req, resp, next) => {
    // TODO: autorizat pt universitati si admin
    let params = req.body;

    if (!params.name || !params.usernameList) {
      next("Missing parameters");
    } else {
      Message.addMailingList(params.name, params.usernameList);
      resp.send(utils.success());
    }
  }
);

module.exports = router;

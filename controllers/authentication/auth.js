const express = require("express");
const bcrypt = require("bcrypt");

const utils = require("../utils/utils.js");
const { ServerError } = require("../utils/errors.js");
const { pool, User } = require("../../models");
const { generateToken } = require("../security/jwt.js");
const jwt = require("../security/jwt.js");

const router = express.Router();

router.get("/login", (req, resp) => {
  resp.render("login");
});

router.get("/register", (req, resp) => {
  resp.render("register");
});

router.get("/forgot-password", (req, resp) => {
  if (req.query.token) {
    resp.render("new-password");
    //ask for new password
  } else {
    resp.render("forgot-password");
    //ask for e-mail
  }
});

router.post("/register", async (req, resp, next) => {
  const params = req.body;
  if (
    params.hasOwnProperty("name") &&
    params.hasOwnProperty("email") &&
    params.hasOwnProperty("username") &&
    params.hasOwnProperty("password")
  ) {
    const name = params.username;
    const email = params.email;
    const username = params.username;
    const password = params.password;

    let user = new User(name, email, password, username, "student");

    try {
      let result = await user.save();
      console.log(result);
      resp.send(utils.success({ url: "/auth/login" }));
    } catch (error) {
      console.log(error);
      resp.status(500).send(utils.error(error.message));
    }
  } else {
    resp.status(404).send(utils.MISSING_PARAMS);
  }
});

router.post("/login", (req, resp) => {
  const params = req.body;

  if (params.hasOwnProperty("username") && params.hasOwnProperty("password")) {
    const username = params.username;
    const password = params.password;

    //validate parameters
    //1. username should be text
    //2. username should not contain special characters
    //3. username.length between x and y

    const checkUserStm = {
      text: "SELECT * FROM public.users WHERE username=$1",
      values: [username],
    };

    pool.query(checkUserStm, (queryErr, queryResp) => {
      if (queryErr) {
        console.log(utils.GENERAL_ERR);
        console.log(queryErr);
        resp.status(500).send(utils.GENERAL_ERR);
        return;
      }
      if (queryResp.rows.length == 0) {
        console.log(utils.USER_NOT_EXISTS);
        resp.status(404).send(utils.USER_NOT_EXISTS);
        return;
      }

      const currentUser = queryResp.rows[0];

      bcrypt.compare(
        password,
        currentUser.password,
        async (cryptErr, cryptResp) => {
          if (cryptResp) {
            //success
            let token = await generateToken({
              userId: currentUser.id,
              userRole: currentUser.role,
            });
            console.log(token);
            resp.cookie("token", token);
            resp.send(utils.success({ url: "/", token }));
          } else {
            console.log(utils.WRONG_PASSWD);
            resp.status(403).send(utils.WRONG_PASSWD);
          }
        }
      );
    });
  } else {
    console.log(utils.MISSING_PARAMS);
    resp.status(403).send(utils.MISSING_PARAMS);
  }
});

router.post("/forgot-password", async (req, resp) => {
  if (req.query.token) {
    let token = req.query.token;
    let newPassword = req.body.password;

    //crypt password
    let cryptedPassword = await bcrypt.hash(newPassword, 10);

    let decodedToken = await jwt.verifyAndDecodeData(token);
    let userId = decodedToken.userId;

    const stm = `UPDATE public.users SET password='${cryptedPassword}' WHERE id=${userId}`;

    pool.query(stm);

    resp.send(utils.success({}));
  } else {
    let email = req.body.email;

    const stm = {
      text: "SELECT * FROM public.users WHERE email=$1",
      values: [email],
    };

    let result = await pool.query(stm);

    if (result.rows.length != 1) {
      resp.status(403).send(utils.MISSING_PARAMS);
    } else {
      let token = await generateToken(
        {
          userId: result.rows[0].id,
          userRole: result.rows[0].role,
        },
        true
      );

      var api_key = "6128be562d5755a80756391bc1fb7708-ea44b6dc-3770598b";
      var DOMAIN = "sandbox29df8baba2bc4a4a9ca791fb82ca5fba.mailgun.org";
      const mailgun = require("mailgun-js");
      const mg = mailgun({ apiKey: api_key, domain: DOMAIN });
      const data = {
        from: "test test@mailgun.org",
        to: email,
        subject: "Hello",
        text:
          "Please go to: http://localhost:4000/auth/forgot-password?token=" +
          token,
      };
      mg.messages().send(data, function (error, body) {
        console.log(body);
      });
    }
  }

  resp.send(utils.success({}));
});

module.exports = router;

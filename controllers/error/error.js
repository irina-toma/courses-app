const express = require("express");
const router = express.Router();

router.get("/", async (req, resp, next) => {
  resp.render("error");
  next();
});

module.exports = router;

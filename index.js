const express = require("express");
const cookierParser = require("cookie-parser");
const users = require("./controllers/users/users.js");
const auth = require("./controllers/authentication/auth.js");
const courses = require("./controllers/courses/courses.js");
const base = require("./controllers/base/base.js");

const cors = require("cors");

const app = express();

app.set("views", "./views");
app.set("view engine", "pug");

app.use(cors());

app.use(express.json()); //middleware for extracting the json body
app.use(cookierParser());

app.use((err, req, res, next) => {
  console.trace(err);
  let status = 500;
  let message = "Something Bad Happened";
  if (err.httpStatus) {
    status = err.httpStatus;
    message = err.message;
  }
  res.status(status).json({
    error: message,
  });
});

// app.use('/users', users);
app.use("/auth", auth);
app.use("/courses", courses);

// should be the last route
app.use("/", base);

app.listen(4000, () => {
  // console.log('App listening on port 4000');
});

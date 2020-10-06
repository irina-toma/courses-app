const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const pool = require("./pool.js");
const utils = require("../controllers/utils/utils.js");
const saltRounds = 10;

const { ServerError } = require("../controllers/utils/errors.js");

class User {
  constructor(name, email, password, username, role, active = true) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.username = username;
    this.role = role;
    this.active = active;
  }

  async save() {
    // validate email and username
    const checkCredentialsStm = {
      text: "SELECT * FROM public.users WHERE username=$1 OR email=$2",
      values: [this.username, this.email],
    };

    let users = await pool.query(checkCredentialsStm);
    if (users.rows.length > 0) {
      throw new ServerError("User exists!", 500);
    }

    //email and username do not exist, proceed with adding the user in the db

    //crypt password
    let cryptedPassword = await bcrypt.hash(this.password, saltRounds);

    //add user
    const insertUserStm = {
      text:
        "INSERT INTO users(name, email, password, active, activation_token, username, role) VALUES($1, $2, $3, $4, $5, $6, $7)",
      values: [
        this.name,
        this.email,
        cryptedPassword,
        this.active,
        uuidv4(),
        this.username,
        this.role,
      ],
    };

    let result = pool.query(insertUserStm);

    return result;

    //de continuat si login
  }

  async addUserDetails(id) {}
}

module.exports = User;

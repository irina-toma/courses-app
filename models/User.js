const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const pool = require("./pool.js");
const utils = require("../controllers/utils/utils.js");
const saltRounds = 10;

const { ServerError } = require("../controllers/utils/errors.js");

class User {
  constructor(name, email, password, username, role, active = true, id = null) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.username = username;
    this.role = role;
    this.active = active;
    this.id = id;
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

    let result = await pool.query(insertUserStm);

    return result;

    //de continuat si login
  }

  async addUserDetails(
    address = null,
    birthdate = null,
    genre = null,
    aboutMe = null,
    socialId = null,
    imageURL = null
  ) {
    // does not change user details, just adds
    // TODO: it should be done for other type of details, such as birthdate, genre, about_me, social, image
    //FIXME: de ce address null?
    let addressId;

    if (address) {
      const stm = {
        text:
          "INSERT INTO addresses(street, number, city, postal_code, country) VALUES($1, $2, $3, $4, $5) RETURNING *",
        values: [
          address.street,
          address.number,
          address.city,
          address.postalCode,
          address.country,
        ],
      };

      let result = await pool.query(stm);
      addressId = result.rows[0].id;
    }

    // user address id needs to be set in the user details area
    const stm = {
      text: "SELECT * from users WHERE email=$1",
      values: [this.email],
    };

    let result = await pool.query(stm);
    let dbUser = result.rows[0];

    if (dbUser.details_id) {
      // update details for user
      const stm = {
        text: "UPDATE user_details SET address_id=$1 where id=$2",
        values: [addressId, dbUser.details_id],
      };
      await pool.query(stm);
    } else {
      //create new details
      const stm = {
        text:
          "INSERT INTO user_details(user_id, address_id) VALUES($1, $2) RETURNING *",
        values: [dbUser.id, addressId],
      };
      let result = await pool.query(stm);
      let detailsId = result.rows[0].id;

      //update user to set details id
      stm = {
        text: "UPDATE users SET details_id=$1 WHERE id=$2",
        values: [detailsId, dbUser.id],
      };
      await pool.query(stm);
    }
  }

  static async findByEmail(email) {
    return await User.findBy("email", email);
  }

  static async findByUsername(username) {
    return await User.findBy("username", username);
  }

  static async findBy(field, value) {
    const stm = {
      text: `SELECT * FROM users WHERE ${field}=$1`,
      values: [value],
    };

    let result = await pool.query(stm);

    if (result.rows.length == 1) {
      const tmp = result.rows[0];
      return new User(
        tmp.name,
        tmp.email,
        "",
        tmp.username,
        tmp.role,
        tmp.active,
        tmp.id
      );
    }

    return null;
  }
}

module.exports = User;

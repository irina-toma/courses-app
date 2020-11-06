const jwt = require("jsonwebtoken");
const { ServerError } = require("../utils/errors.js");

const options = {
  issuer: process.env.JWT_ISSUER,
  subject: process.env.JWT_SUBJECT,
  audience: process.env.JWT_AUDIENCE,
};

const generateToken = async (payload, shouldExpire = false) => {
  try {
    if (shouldExpire) {
      options.expiresIn = 600;
    }
    const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, options);
    return token;
  } catch (err) {
    throw new ServerError("Error encoding token!", 500);
  }
};

const verifyAndDecodeData = async (token) => {
  try {
    const decoded = await jwt.verify(
      token,
      process.env.JWT_SECRET_KEY,
      options
    );
    return decoded;
  } catch (err) {
    throw new ServerError("Error decoding token!", 500);
  }
};

const authorizeAndExtractToken = async (req, res, next) => {
  try {
    const decoded = await decodeToken(req);

    // set decoded token in state
    req.state = {
      decoded,
    };

    next();
  } catch (err) {
    res.redirect("/error");
    next();
  }
};

const decodeToken = async (req) => {
  let token;
  if (!req.headers.authorization && !req.cookies.token) {
    throw new ServerError("Missing authorization header!", 403);
  }

  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
    console.log("Token in header:" + token);
  }
  if (req.cookies.token) {
    token = req.cookies.token;
    console.log("Token in cookie:" + token);
  }

  const decoded = await verifyAndDecodeData(token);
  return decoded;
};

module.exports = {
  generateToken,
  authorizeAndExtractToken,
  decodeToken,
  verifyAndDecodeData,
};

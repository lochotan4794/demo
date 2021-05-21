const config = require("config");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied! No token provided");
  try {
    const payload = jwt.verify(token, config.get("jwtSecureKey"));
    req.profile = payload;
    next();
  } catch (ex) {
    res.status(401).send("Invalid token");
  }
};

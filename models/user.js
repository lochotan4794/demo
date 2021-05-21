const config = require("config");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 32 },
  email: { type: String, required: true, unique: true, minlength: 5 },
  password: { type: String, required: true, minlength: 5 },
  phone: { type: String, required: true },
  wishlist: { type: Array, default: [] },
  orderHistory: { type: Array, default: [] },
  avatar: { type: String, default: "defaultAvatar.png" },
  role: { type: Number, default: 0 },
  address: String,
});

userSchema.methods.generateAuthToken = function() {
  return (token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      role: this.role,
    },
    config.get("jwtSecureKey"),
    { expiresIn: "1h" }
  ));
};

const User = mongoose.model("User", userSchema);

function validRegister(user) {
  const schema = new Joi.object({
    email: Joi.string()
      .required()
      .min(5)
      .email(),
    password: Joi.string()
      .required()
      .min(5)
      .max(32),
    name: Joi.string()
      .required()
      .min(5)
      .max(32),
    phone: Joi.string().required(),
  });
  return schema.validate(user);
}

function validLogin(user) {
  const schema = Joi.object({
    email: Joi.string()
      .required()
      .min(5)
      .email(),
    password: Joi.string()
      .required()
      .min(5)
      .max(32),
  });
  return schema.validate(user);
}

module.exports.User = User;
module.exports.userSchema = userSchema;
module.exports.validLogin = validLogin;
module.exports.validRegister = validRegister;

const { User, validLogin, validRegister } = require("../models/user");
const fs = require("fs");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const upload = require("../middlewares/upload");

exports.authUser = async (req, res, next) => {
  const { error } = validLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).send("Invalid email or password");
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).send("Invalid email or password");
    const token = user.generateAuthToken();
    res.send(token);
  } catch (ex) {
    next(ex);
  }
};

exports.authAdmin = async (req, res, next) => {
  const { error } = validLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).send("Invalid email or password");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).send("Invalid email or password");
    if (user.role !== 1)
      return res.status(403).send("Access Denied! You're not admin");
    const token = user.generateAuthToken();
    res.send(token);
  } catch (ex) {
    next(ex);
  }
};

exports.createUser = async (req, res, next) => {
  const { error } = validRegister(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { name, email, password, phone } = req.body;
  let user = await User.findOne({ email });
  if (user) return res.status(400).send("User already exits");
  const salt = await bcrypt.genSalt(10);
  user = new User({
    name,
    email,
    password: await bcrypt.hash(password, salt),
    phone,
  });
  try {
    await user.save();
    const token = user.generateAuthToken();
    res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send(_.pick(user, ["name", "email"]));
  } catch (ex) {
    next(ex);
  }
};

exports.editUser = async (req, res, next) => {
  upload.single("avatar")(req, res, async (err) => {
    if (err) {
      res.status(400).send("Error while uploading image");
    } else {
      const { phone, address } = req.body;
      const updateBody = req.file
        ? { phone, address, avatar: req.file.filename }
        : { phone, address };
      let user = await User.findByIdAndUpdate(req.params.id, updateBody, {
        new: true,
      });
      res.send(_.pick(user, ["name", "email", "avatar", "phone", "address"]));
    }
  });
};
exports.editMe = async (req, res, next) => {
  upload.single("avatar")(req, res, async (err) => {
    if (err) {
      res.status(400).send("Error while uploading image");
    } else {
      const { phone, address } = req.body;
      const updateBody = req.file
        ? { phone, address, avatar: req.file.filename }
        : { phone, address };
      try {
        let user = await User.findByIdAndUpdate(req.profile._id, updateBody, {
          new: true,
        });
        res.send(_.pick(user, ["name", "email", "avatar", "phone", "address"]));
      } catch (ex) {
        next(ex);
      }
    }
  });
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) return res.status(404).send("Invalid user");
    fs.unlink("./public/assets/" + user.avatar, (err) => {
      if (err) {
        next(err);
      }
    });
    res.send("User is deleted");
  } catch (ex) {
    next(ex);
  }
};

exports.getAllUser = async (req, res, next) => {
  try {
    const user = await User.find().sort("name");
    res.send(user);
  } catch (ex) {
    next(ex);
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const id = req.profile._id;
    const user = await User.findById(id);
    res.send(_.pick(user, ["name", "email", "avatar", "phone", "address"]));
  } catch (ex) {
    next(ex);
  }
};

exports.searchUser = async (req, res, next) => {
  try {
    const { name } = req.query;
    const query = ".*" + name + ".*";
    const users = await User.find({
      name: { $regex: new RegExp(query), $options: "i" },
    });
    res.send(users);
  } catch (ex) {
    next(ex);
  }
};

exports.isUserValid = async (req, res, next) => {
  try {
    res.send(req.profile);
  } catch (ex) {
    next(ex);
  }
};

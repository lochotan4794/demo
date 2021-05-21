const config = require("config");
const mongoose = require("mongoose");
module.exports = function () {
  mongoose
    .connect(config.get("db"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true,
    })
    .then(() => console.log("Connect to DB..."))
    .catch((err) => console.log(err));
};

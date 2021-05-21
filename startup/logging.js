const config = require("config");
const winston = require("winston");
require("winston-mongodb");
module.exports = function() {
  process.on("uncaughtException", (ex) => {
    console.log(ex.message);
    winston.error(ex.message, ex);
    process.exit(1);
  });

  process.on("unhandledRejection", (ex) => {
    console.log(ex.message);
    winston.error(ex.message, ex);
    process.exit(1);
  });

  winston.add(new winston.transports.File({ filename: "logfile.log" }));
  winston.add(
    new winston.transports.MongoDB({ db: config.get("db"), level: "error" })
  );
};

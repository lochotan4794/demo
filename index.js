var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const bodyParser = require("body-parser");
const app = express();

require("./startup/logging")();
require("./startup/db")();
require("./startup/route")(app);

// uncomment after placing your favicon in /public
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  var whitelist = ["localhost:3000", "localhost:3001", "alphazi.herokuapp.com"];
  //var whitelist = ["alphazi.herokuapp.com"];
  var host = req.get("host");
  whitelist.forEach(function (val, key) {
    if (host.indexOf(val) > -1) {
      res.setHeader("Access-Control-Allow-Origin", host);
      res.setHeader("Content-Type", "multipart/form-data");
    }
  });
  next();
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log("Server listening on port", port));

const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
let moment = require("moment");

module.exports = function (app) {
  const limiter = rateLimit({
    rateLimit: 1 * 60 * 1000,
    max: 2000000,
  });
  app.use(limiter);
  app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
  app.use(bodyParser.json({ limit: "5mb" }));
  app.use(compression());
  app.use(helmet());
  var whitelist = ["http://localhost:3000", "http://localhost:4200"];
  var corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  };
  app.use(cors(corsOptions));
  let CurrentDate = moment().tz("Asia/Kolkata").format("MMMM Do YYYY");
  let accessLogStream = fs.createWriteStream(
    path.join(__dirname, "../accessLog/" + CurrentDate + ".log"),
    { flags: "a" }
  );
  morgan.token("date", function () {
    var p = new Date()
      .toString()
      .replace(/[A-Z]{3}\+/, "+")
      .split(/ /);
    return p[2] + "/" + p[1] + "/" + p[3] + ":" + p[4] + " " + p[5];
  });
  app.use(morgan("combined", { stream: accessLogStream }));

  //VALIDATE ALL INCOMING REQUEST TOKEN
  app.use((req, res, next) => {
    if (req.path.includes("auth")) next();
    else {
      try {
        let token = req.headers.authorization.split(" ")[1];
        if (!token) {
          let resp = {
            status: 403,
            msg: "Access Denied",
            err: "Authorization Not Found !",
          };
          res.status(403).send(resp);
        }
        try {
          jwt.verify(token, process.env.TokenSecret);
          next();
        } catch (err) {
          let resp = {
            status: 401,
            msg: "Access Denied",
            err: "Token Expired (or) Invalid Token",
          };
          res.status(401).send(resp);
        }
      } catch (err) {
        let resp = {
          status: 403,
          msg: "Access Denied",
          err: "Authorization Not Found !",
        };

        res.status(403).send(resp);
      }
    }
  });


};

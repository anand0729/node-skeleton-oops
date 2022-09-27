const express = require("express");

const app = express();

const server = require("http").createServer(app);

const router = express.Router();
require("dotenv").config();

const db = require("./config/database");

require("./models");

require("./middleware")(app);

const routes = require("./routes")(router, {});
app.use("/", routes);
const { sequelize } = require("./config/database");
sequelize
  .authenticate()
  .then(() => {
    db.sequelize
      .sync((force) => true)
      .then(function () {
        console.log("Database Connected");
      });
  })
  .catch((err) => console.error(`Issue while connecting DB ${err.message}`));
let port = process.env.ServerPort || 3000;

server.listen(port, () => {
  console.log("NodeStarted", port);
});

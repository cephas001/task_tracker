const mongoose = require("mongoose");
require("dotenv").config({ path: "./config.env" });
const connectionString = process.env.CONNECTION_STRING;

const connection = mongoose
  .createConnection(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .once("open", function () {
    console.log(`Mongo Database running on ${connection.host}`);
  })
  .on("error", function (err) {
    console.log(err);
  });

module.exports = connection;

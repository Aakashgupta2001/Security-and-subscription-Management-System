const express = require("express");
const app = express();
const mongo = require("mongoose");
require("dotenv").config();
const cors = require("cors");

app.use(cors());

//mongo options and connections
mongo.set("strictQuery", false);
mongo.connect(process.env.MONGO_CONNECT, (err) => {
  if (err) {
    console.log(err);
  } else console.log("connected to mongo");
});

//routes
require("./app/routes/routes").default(app);

//starting server
const port = process.env.PORT || 3001;
app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else console.log("Server is running on port", port);
});

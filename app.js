require("dotenv").config();

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const app = express();

//DB Connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB CONNECTED"));

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//PORT
const port = process.env.PORT || 8000;

//Starting a server
app.listen(port, () => console.log(`app is running at ${port}`));

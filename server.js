const express = require("express");
require('express-async-errors');
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const path = require('path');
const bodyParser = require('body-parser');







const app = express()
app.get("/", async (req, res) => {
  res.send("Welcome")
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//Global Error Handler
app.use((err, req, res, next) => {
  return res.status(500).send('Something Wrong!!!');
})


//Route
app.use("/api/v1/snn", require("./Router/SNNRouter"));

app.listen(3004, () => {
  console.log("Server is running in port 3004")
})
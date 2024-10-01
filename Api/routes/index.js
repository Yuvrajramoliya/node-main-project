const express = require("express");
const route = express.Router();

route.use("/admin", require("./admin"))
route.use("/manager",require("./manager"))
route.use("/employee",require("./employee"))

module.exports = route
const express = require("express");
const route = express.Router();
const managerCtl = require("../controllers/employeeClt")
const auth = require("../config/employeeAuth")

route.post("/registerEmployee", managerCtl.registerEmployee);
route.post("/loginEmployee", managerCtl.loginEmployee);
route.get("/viewEmployee", auth, managerCtl.viewEmployee);
route.post("/changeEmployeePass", auth, managerCtl.changeEmployeerPass);
route.post("/forgetEmployeePass", managerCtl.forgetEmployeePass);

module.exports = route
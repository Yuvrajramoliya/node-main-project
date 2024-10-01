const express = require("express");
const route = express.Router();
const adminCtl = require("../controllers/adminCtl")
const auth = require("../config/adminAuth")

route.post("/registerAdmin", adminCtl.registerAdmin);
route.post("/loginAdmin", adminCtl.loginAdmin);
route.get("/viewAdmin", auth, adminCtl.viewAdmin);
route.post("/changeAdminPass", auth, adminCtl.changeAdminPass);
route.post("/forgetAdminPass", adminCtl.forgetAdminPass);

module.exports = route
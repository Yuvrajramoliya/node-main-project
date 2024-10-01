const express = require("express");
const route = express.Router();
const managerCtl = require("../controllers/managerClt")
const auth = require("../config/managerAuth")

route.post("/registerManager", managerCtl.registerManager);
route.post("/loginManager", managerCtl.loginManager);
route.get("/viewManager", auth, managerCtl.viewManager);
route.post("/changeManagerPass", auth, managerCtl.changeManagerPass);
route.post("/forgetManagerPass", managerCtl.forgetManagerPass);

module.exports = route
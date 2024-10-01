let employeeSchema = require("../models/employeeSchema")
let brcypt = require("bcrypt");
let moment = require("moment");
let jwt = require("jsonwebtoken")
let mailer = require("../config/mailer")


module.exports.registerEmployee = async (req, res) => {
    req.body.password = await brcypt.hash(req.body.password, 10);
    req.body.createdAt = moment().format('DD-MM-YYYY, h:mm:ss a');

    let employeeData = await employeeSchema.create(req.body);

    employeeData ? res.status(200).json({ msg: "employee registered" }) : res.status(400).json({ msg: "employee not registered" })
}

module.exports.loginEmployee = async (req, res) => {
    let employeeData = await employeeSchema.findOne({ email: req.body.email });
    if (employeeData) {
        if (await brcypt.compare(req.body.password, employeeData.password)) {
            let token = jwt.sign({ employeeData: employeeData }, "employeekey", { expiresIn: "1h" })
            res.status(200).json({ msg: "passwrod is right", managerToken: token })
        } else {
            res.status(400).json({ msg: "passwrod is wrong" })
        }
    } else {
        res.status(400).json({ msg: "employee not found" })
    }
}

module.exports.viewEmployee = async (req, res) => {
    let managerExist = await employeeSchema.findById(req.user.employeeData._id)
    managerExist ? res.status(200).json({ msg: "employee data found", data: managerExist }) : res.status(400).json({ msg: "employee not found" })
}
module.exports.changeEmployeerPass = async (req, res) => {
    console.log("Old password from request body:", req.body.oldPass);
    console.log("employee data from token:", req.user.employeeData);

    if (await brcypt.compare(req.body.oldPass, req.user.employeeData.password)) {
        if (req.body.newPass == req.body.conPass) {
            let bPass = await brcypt.hash(req.body.newPass, 10);
            let change = await employeeSchema.findByIdAndUpdate(req.user.employeeData._id, { password: bPass })
            res.status(200).json({ msg: "password is changed" })
        } else {
            res.status(400).json({ msg: "new password and confirm password must be the same" })
        }
    } else {
        res.status(400).json({ msg: "password is wrong" })
    }
}


module.exports.forgetEmployeePass = async (req, res) => {
    let employeeData = await employeeSchema.findOne({ email: req.body.email });

    if (!employeeData) {
        return res.status(400).json({ msg: "employee email is wrong" })
    }

    let otp = Math.floor(Math.random() * 100000 + 900000);
    mailer.adminOtp(req.body.email, otp);

    res.cookie("otp", otp);
    res.cookie("adminId", employeeData._id)

    res.status(200).json({ msg: "otp is sended to your email" })
    console.log(otp);
}


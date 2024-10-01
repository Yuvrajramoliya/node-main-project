let adminSchema = require("../models/adminSchema")
let brcypt = require("bcrypt");
let moment = require("moment");
let jwt = require("jsonwebtoken")
let mailer = require("../config/mailer")


module.exports.registerAdmin = async (req, res) => {
    req.body.password = await brcypt.hash(req.body.password, 10);
    req.body.createdAt = moment().format('DD-MM-YYYY, h:mm:ss a');

    let adminData = await adminSchema.create(req.body);

    adminData ? res.status(200).json({ msg: "admin registered" }) : res.status(400).json({ msg: "admin not registered" })
}

module.exports.loginAdmin = async (req, res) => {
    let adminData = await adminSchema.findOne({ email: req.body.email });
    if (adminData) {
        if (await brcypt.compare(req.body.password, adminData.password)) {
            let token = jwt.sign({ adminData: adminData }, "AdminKey", { expiresIn: "1h" })
            res.status(200).json({ msg: "passwrod is right", adminToken: token })
        } else {
            res.status(400).json({ msg: "passwrod is wrong" })
        }
    } else {
        res.status(400).json({ msg: "admin not found" })
    }
}

module.exports.viewAdmin = async (req, res) => {
    let adminExist = await adminSchema.findById(req.user.adminData._id)
    adminExist ? res.status(200).json({ msg: "admin data found", data: adminExist }) : res.status(400).json({ msg: "admin not found" })
}
module.exports.changeAdminPass = async (req, res) => {
    console.log("Old password from request body:", req.body.oldPass);
    console.log("Admin data from token:", req.user.adminData);

    if (await brcypt.compare(req.body.oldPass, req.user.adminData.password)) {
        if (req.body.newPass == req.body.conPass) {
            let bPass = await brcypt.hash(req.body.newPass, 10);
            let change = await adminSchema.findByIdAndUpdate(req.user.adminData._id, { password: bPass })
            res.status(200).json({ msg: "password is changed" })
        } else {
            res.status(400).json({ msg: "new password and confirm password must be the same" })
        }
    } else {
        res.status(400).json({ msg: "password is wrong" })
    }
}


module.exports.forgetAdminPass = async (req, res) => {
    let adminData = await adminSchema.findOne({ email: req.body.email });

    if (!adminData) {
        return res.status(400).json({ msg: "admin email is wrong" })
    }

    let otp = Math.floor(Math.random() * 100000 + 900000);
    mailer.adminOtp(req.body.email, otp);

    res.cookie("otp", otp);
    res.cookie("adminId", adminData._id)

    res.status(200).json({ msg: "otp is sended to your email" })
    console.log(otp);
}


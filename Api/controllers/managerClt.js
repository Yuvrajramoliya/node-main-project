let managerSchema = require("../models/managerShema")
let brcypt = require("bcrypt");
let moment = require("moment");
let jwt = require("jsonwebtoken")
let mailer = require("../config/mailer")


module.exports.registerManager = async (req, res) => {
    req.body.password = await brcypt.hash(req.body.password, 10);
    req.body.createdAt = moment().format('DD-MM-YYYY, h:mm:ss a');

    let managerData = await managerSchema.create(req.body);

    managerData ? res.status(200).json({ msg: "manager registered" }) : res.status(400).json({ msg: "manager not registered" })
}

module.exports.loginManager = async (req, res) => {
    let managerData = await managerSchema.findOne({ email: req.body.email });
    if (managerData) {
        if (await brcypt.compare(req.body.password, managerData.password)) {
            let token = jwt.sign({ managerData: managerData }, "managerKey", { expiresIn: "1h" })
            res.status(200).json({ msg: "passwrod is right", managerToken: token })
        } else {
            res.status(400).json({ msg: "passwrod is wrong" })
        }
    } else {
        res.status(400).json({ msg: "manager not found" })
    }
}

module.exports.viewManager = async (req, res) => {
    let managerExist = await managerSchema.findById(req.user.managerData._id)
    managerExist ? res.status(200).json({ msg: "manager data found", data: managerExist }) : res.status(400).json({ msg: "manager not found" })
}
module.exports.changeManagerPass = async (req, res) => {
    console.log("Old password from request body:", req.body.oldPass);
    console.log("Manager data from token:", req.user.managerData);

    if (await brcypt.compare(req.body.oldPass, req.user.managerData.password)) {
        if (req.body.newPass == req.body.conPass) {
            let bPass = await brcypt.hash(req.body.newPass, 10);
            let change = await managerSchema.findByIdAndUpdate(req.user.managerData._id, { password: bPass })
            res.status(200).json({ msg: "password is changed" })
        } else {
            res.status(400).json({ msg: "new password and confirm password must be the same" })
        }
    } else {
        res.status(400).json({ msg: "password is wrong" })
    }
}


module.exports.forgetManagerPass = async (req, res) => {
    let managerData = await managerSchema.findOne({ email: req.body.email });

    if (!managerData) {
        return res.status(400).json({ msg: "manager email is wrong" })
    }

    let otp = Math.floor(Math.random() * 100000 + 900000);
    mailer.adminOtp(req.body.email, otp);

    res.cookie("otp", otp);
    res.cookie("adminId", managerData._id)

    res.status(200).json({ msg: "otp is sended to your email" })
    console.log(otp);
}


const jwt = require("jsonwebtoken");
const adminSchema = require("../models/adminSchema")

const auth = (req, res, next) => {
    let token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ msg: "token invalid" })
    }
    let newToken = token.slice(7, token.length);

    let decode = jwt.verify(newToken, "AdminKey");
    if (decode) {

    }
    req.user = decode
    next();
}

module.exports = auth
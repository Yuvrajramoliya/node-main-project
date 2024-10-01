const express = require("express");
const port = 9002;

const app = express();
const db = require("./config/db")
const cookieParser = require("cookie-parser");

app.use(express.urlencoded())
app.use(cookieParser());

app.use("/", require("./routes/index"))


app.listen(port, (err) => {
    err ? console.log(err) : console.log("server started on port " + port);
})
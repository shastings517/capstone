var mongoose = require("mongoose");
mongoose.connect(process.env.MONGOLAB_URI || "mongodb://localhost/satauth");
mongoose.set("debug",true);

module.exports.User = require("./user");
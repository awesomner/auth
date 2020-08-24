var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var PageSchema = new mongoose.Schema({
  pass: String
});

PageSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Page", PageSchema);
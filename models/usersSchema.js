/* This Schema stores the List of users of the library */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose   = require("passport-local-mongoose");
var bcrypt = require('bcrypt');
const UsersSchema = new Schema({
  User_name: { type: String },
  Name: { type: String },
  Email_Address: { type: String },
  Password: { type: String },
  Role: { type: String },
  Date_created: { type: Date }
});

UsersSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.Password, 10, function (err, hash){
    if (err) {
      return next(err);
    }
    user.Password = hash;
    next();
  })
});
UsersSchema.plugin(passportLocalMongoose); 
// Export model
module.exports = mongoose.model("users", UsersSchema);

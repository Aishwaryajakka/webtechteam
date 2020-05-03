/* This Schema stores the Books issused by the users*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  User_Name: { type: String },
  Code: { type: String },
  Type: { type: String },
  Name :{type:String},
  Available_copies :{type: Number}
});

// Export model
module.exports = mongoose.model("Cart", cartSchema);

/* This Schema stores the Catalog of books in the library */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookSchema = new Schema({
  Book_Code: { type: String },
  Book_Name: { type: String },
  Author: { type: String },
  Genre: { type: String },
  Published_Year: { type: Number },
  No_of_Pages: { type: Number },
  Copies: { type: Number },
  Available_copies : {type:Number}
});

// Export model
module.exports = mongoose.model("books", BookSchema);

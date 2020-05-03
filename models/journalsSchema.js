/* This Schema stores the Catalog of Journals in the library */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const JournalSchema = new Schema({
  Journal_Code: { type: String },
  Journal_Name: { type: String },
  Editor: { type: String },
  Genre: { type: String },
  First_Published: { type: Date },
  Frequency: { type: String },
  Copies: { type: Number },
  Available_copies : {type:Number}
});

// Export model
module.exports = mongoose.model("journals", JournalSchema);

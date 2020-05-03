/* This Schema stores the Books issused by the users*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const issuesSchema = new Schema({
  // Asset_Id: { type: Number },
  // Asset_Name: { type: String },
  // Asset_Description: { type: String },
  // Borrower_Id: { type: Number },
  // Borrower_Name: { type: String },
  // Borrower_Email: { type: String },
  // Issue_Date: { type: Date },
  // Return_Date: { type: Date }
     User_Name: { type: String },
  Code: { type: String },
  Type: { type: String },
  Name: { type: String },
  Issue_Date: { type: Date },
  Return_Date: { type: Date }
});

// Export model
module.exports = mongoose.model("Issues", issuesSchema);

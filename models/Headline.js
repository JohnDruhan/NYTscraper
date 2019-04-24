// Headline model
// ==============

// Require mongoose
var mongoose = require("mongoose");

// Create a schema class using mongoose's schema method
var Schema = mongoose.Schema;

// Create headlineSchema
var headlineSchema = new Schema({
  // headline string
  headline: {
    type: String,
    required: true,
    unique: { index: { unique: true } }
  },
  // summary string
  summary: {
    type: String,
    required: true
  },
  // url string
  url: {
    type: String,
    required: true
  },
  // date string
  date: {
    type: Date,
    default: Date.now
  },
  saved: {
    type: Boolean,
    default: false
  }
});

// Headline model using the headlineSchema
var Headline = mongoose.model("Headline", headlineSchema);

// Export the Headline model
module.exports = Headline;

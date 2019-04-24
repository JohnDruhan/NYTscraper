// Note model

// Require mongoose
var mongoose = require("mongoose");
// Create schema class mongoose.schema
var Schema = mongoose.Schema;

// Create the noteSchema 
var noteSchema = new Schema({
  // The headline is the article associate with the note
  _headlineId: {
    type: Schema.Types.ObjectId,
    ref: "Headline"
  },
  // date string
  date: {
    type: Date,
    default: Date.now
  },
  // noteText string
  noteText: String
});

// Create Note model 
var Note = mongoose.model("Note", noteSchema);

// Export the Note model
module.exports = Note;

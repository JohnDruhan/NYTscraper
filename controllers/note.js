// Controller for our notes
// ========================
var db = require("../models");

module.exports = {
  // Find note
  find: function(req, res) {
    db.Note.find({ _headlineId: req.params.id }).then(function(dbNote) {
      res.json(dbNote);
    });
  },
  // Create new note
  create: function(req, res) {
    db.Note.create(req.body).then(function(dbNote) {
      res.json(dbNote);
    });
  },
  // Delete note with id
  delete: function(req, res) {
    db.Note.remove({ _id: req.params.id }).then(function(dbNote) {
      res.json(dbNote);
    });
  }
};

// Require dependencies
var express = require("express");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

//  Port 3000
var PORT = process.env.PORT || 3000;

// Instantiate Express App
var app = express();

// Require routes
var routes = require("./routes");

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public static folder
app.use(express.static("public"));

// Connect Handlebars Express app
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Route middleware
app.use(routes);

// Use deployed database. Otherwise use local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Connect to Mongo DB
mongoose.connect(MONGODB_URI);

// Listen on the port
app.listen(PORT, function() {
  console.log("Listening on port: " + PORT);
});

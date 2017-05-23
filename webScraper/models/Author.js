// Require mongoose
var mongoose = require("mongoose");

// Create a Schema class with mongoose
var Schema = mongoose.Schema;

// Create a UserSchema with the Schema class
var AuthorSchema = new Schema({
  // name: a unique String
  name: {
    type: String,
    unique: true
  },
  // notes property for the user
  articles: [{
    // Store ObjectIds in the array
    type: Schema.Types.ObjectId,
    // The ObjectIds will refer to the ids in the Note model
    ref: "Article"
  }]
});

// Create the User model with the UserSchema
var Author = mongoose.model("Author", AuthorSchema);

// Export the Author model
module.exports = Author;

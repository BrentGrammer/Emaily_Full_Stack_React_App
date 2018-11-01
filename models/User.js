const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * This file creates a model class which mongoose uses to create a collection in MongoDB.
 */

// define the Schema to tell mongoose the shape of a record in the collection
const userSchema = new Schema({
  googleId: String
});

// Create the model class with .model() and pass in the name of the collection and the schema defined above.
mongoose.model('users', userSchema);
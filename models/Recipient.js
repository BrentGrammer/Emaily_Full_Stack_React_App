const mongoose = require('mongoose');
const { Schema } = mongoose;

const recipientSchema = new Schema({
  email: String,
  responded: { type: Boolean, default: false }
});

// This is configuring a sub-document collection:
// Simply define the schema and export it in this file (without calling mongoose.model to create a model class).
module.exports = recipientSchema;
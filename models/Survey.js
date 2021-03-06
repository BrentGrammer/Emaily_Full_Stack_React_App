const mongoose = require('mongoose');
const { Schema } = mongoose;
// import the schema for the sub-document collection setup
const RecipientSchema = require('./Recipient');

const surveySchema = new Schema({
  title: String,
  body: String,
  subject: String,
  recipients: [RecipientSchema],  // sets up a sub-document collection - an array of recipient documents
  yes: { type: Number, default: 0 },
  no: { type: Number, default: 0 },
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  dateSent: Date, // this date object will be returned to the client as a string timestamp
  lastResponded: Date
});

mongoose.model('surveys', surveySchema);
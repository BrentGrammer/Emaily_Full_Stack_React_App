const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
// this can be used with payments like Stripe to check that user has purchased credits - can be passed in as additional middleware once
// stripe is setup
//const requreCredits = require('../middlewares/requireCredits');

// create an instance of a model class to use to create an instance of a document from the passed in collection.
const Survey = mongoose.model('surveys');
// SendGrid helper Mailer object
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

/**
 * This route handles creating a new survey and sending a mass email.
 */

// pass in the rqeuireLogin middleware to check if user is logged in - note that you don't call it in this case because a req and res
// object are not in hand yet to process manually, and the middleware will have access when express calls it.
module.exports = app => {

  // response route when user clicks link in email sent:
  app.get('apis/surveys/thanks', (req, res) => {
    res.send('Thanks for voting!');
  });

  /**
   * Alternative way to handle the confirmation route when user clicks link, is to add a redirectUrl field to the survey model which 
   * holds urls that are specific to the link the user clicked in the email and your route handlers for those links can handle a 
   * corresponding custom response.
   */


  app.post('/api/surveys', requireLogin, /* requireCredits, */ async (req, res) => {
    console.log('req body', req.body);
    // note that here, recipients will be a string of comma separated email addresses
    const { title, subject, body, recipients } = req.body;


    const survey = new Survey({
      title,
      subject,
      body,
      // using string.split to create an array of email strings, then return a new array with objects setting the email key to the email
      // also trim the white space on the email since it was split by , and could have a space after the comma in the string list.
      // note that you don't need to set responded field does not need to be set since it is set with a default constraint already in the Schema
      recipients: recipients.split(',').map(email => ({ email: email.trim() }) ),
      _user: req.user.id,
      dateSend: Date.now(), // MongoDB can handle Date objects fine
    });

     // Send survey email with SendGrid:
     const mailer = new Mailer(survey, surveyTemplate(survey));

     try{
       // you need to send the Mailer object with the send method defined on it to get it to SendGrid:
       // mailer.send is asynchronous and returns a promise.
       await mailer.send();
       // save survey to database:
       await survey.save();
       /* This is stripe code when stripe is integrated...
           Deduct credit from user when survey is submitted.
         */
       //req.user.credits -= 1;
       const user = await req.user.save();
       // send back the updated user model from the database.
       res.send(user);
     } catch (err) {
       // status 422 is unprocessable entity - something is wrong with the data sent from the client.
       res.status(422).send(err);
     }
  });
}
const _ = require('lodash');
// this is used to extract data from the url in the webhook sent by SendGrid
const Path = require('path-parser').default;
// url is a default integrated module that comes with Node.js
// This helper comes with methods to grab parts/chunks of the url in the webhook (i.e. the pathname without the domain)
const { URL } = require('url');
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

  //returns list of surveys - note it's a get request while the webhook route is a post request to the same path:
  app.get('/api/surveys', requireLogin, async (req, res) => {
    // find all surveys that have a _user = the user id in the req object set by passport.js\
    // use select chained method on the returned query object to limit the fields queried (so sub-documents are not queried as well)
    const surveys = await Survey.find({ _user: req.user.id })
      .select({ recipients: false });

    res.send(surveys);
  });

  // response route when user clicks link in email sent:
  app.get('/api/surveys/:surveyId/:choice', (req, res) => {
    res.send('Thanks for voting!');
  });

  /**
   * Alternative way to handle the confirmation route when user clicks link, is to add a redirectUrl field to the survey model which 
   * holds urls that are specific to the link the user clicked in the email and your route handlers for those links can handle a 
   * corresponding custom response.
   * 
   *  Filtering of webhook data uses _.chain lodash helper to prevent repetitive passing of the array in iteration steps.
   */

  /**** WEBHOOKS HANDLER *****/
  app.post('/api/surveys/webhooks', (req, res) => {

    // path-parser helper will allow you to take variables from the path url assigned with `:<name>`:
    const p = new Path('/api/surveys/:surveyId/:choice');

    _.chain(req.body)
      // const events = _.map(req.body, (event) => {
      .map(({ email, url }) => {
        console.log('url FROM MAP: ', url);
        // using test on the path-parser route extraction const will return null if operation fails, otherwise it will return 
        // an object that has the wildcard variables extracted as keys and their values.
        // url module from Node will get the route removing the domain name
        const match = p.test(new URL(url).pathname);
        if (match) {
          return { email, surveyId: match.surveyId, choice: match.choice };
        }
      })
      // remove any elements that return undefined from the p.test() call:
      // lodash helper compact removes any undefined elements in an array:
      .compact()
      // remove duplicate events i.e. if user clicked twice on the link and remove them:
      // uniqBy from lodash will remove any entries that have a duplicate value on *all* of the keys passed in:
      .uniqBy('email', 'surveyId')
      .each(({ surveyId, email, choice }) => {
        Survey.updateOne({
           // $inc is a Mongo Operator for incrementing a value, the [choice] is using key interpolation from ES6 to set the key of 
        //the object to the variable choice at runtime.
        
        // $set finds a property in the collection and assigns a value to the field specified.  The $ matches the $elemMatch in 
        //the previous updateOne query and then the responded prop on that match is set to true.
          _id: surveyId,
          recipients: {
            $elemMatch: { email: email, responded: false }
          }
        }, {
          $inc: { [choice]: 1 },
          $set: { 'recipients.$.responded': true } 
        }).exec();
      })
      .value();

      // send empty response to sendgrid - this may help with repeated webhooks being sent
      res.send({});
  });


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
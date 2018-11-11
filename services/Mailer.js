const sendgrid = require('sendgrid');
const helper = sendgrid.mail;
const keys = require('../config/keys');

// this extends your Mailer class with functionality from sendgrid on the Mail object in the helper imported
class Mailer extends helper.Mail {
  // the first arg to the constructor should just be an object with subject and recipients props for reusability
  // The subject and recipients are coming from the survey instance pulled from the database
  constructor({ subject, recipients}, content) {
    super();

    // this is used in the final send method and returns an object that can be used to communicate with the sendgrid api and send the Mailer (pass in your key):
    this.sgApi = sendgrid(keys.sendGridKey);
    // Every Mailer class created from SendGrid has a from_email prop to be set. (this shows who the email is sent from inthe email)
    this.from_email = new helper.Email('no-reply@emaily.com');
    this.subject = subject;
    this.body = new helper.Content('text/html', content);
    // formatAddresses is defined by you to take the recipients object and format it to work with sending to SendGrid if necessary
    // inside the method a sendgrid helper is used to turn the emails into Email instances for use with sendgrid.  In addition you must 
    // add the email instances created to the Mailer object with this.addRecipients which registers the formatted list to the email
    this.recipients = this.formatAddresses(recipients); 

    // addConent is a sendgrid helper from the Mail class which Mailer extends from and is expected to be used with the content formatted
    // with the helper.Content instance from sendgrid as well.
    this.addContent(this.body);
    // set up click tracking with sendgrid so it can reassign links clicked in the email to use to identify the user who clicked.
    // Note: you define this method - it is not a sendgrid helper
    this.addClickTracking();
    this.addRecipients();
  }

  formatAddresses(recipients) {
    // recipients from the database (sub-doc collection to surveys) is an array of objects that include an email prop.
    return recipients.map(({ email }) => {
      // use the sendgrid Email helper to prepare the email to work with SendGrid processing:
      return new helper.Email(email);
    })
  }

  addClickTracking() {
    const trackingSettings = new helper.TrackingSettings();
    const clickTracking = new helper.ClickTracking(true, true);

    // pass in the clickTracking defined and declared to trackingSettings.setClickTracking:
    trackingSettings.setClickTracking(clickTracking);
    // pass in the trackingSettings to the built in sendgrid addTrackingSettings method from extending the Mail class.
    this.addTrackingSettings(trackingSettings);
  }

  // This takes the formatted list of recipients and registers them with the email to be sent with SendGrid
  addRecipients() {
    // this is sendgrid stuff...
    const personalize = new helper.Personalization();
    // this adds each formatted recipient (done in this.formatAddresses) to the personalize object created
    this.recipients.forEach(recipient => {
      personalize.addTo(recipient);
    });
    // builtin sendgrid method from Mail base class which takes the personalize object created.
    this.addPersonalization(personalize);
  }

  // this is used to finally send the Mailer object to SendGrid:
  async send() {
    const request = this.sgApi.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: this.toJSON() // toJSON is from the Mail base class from sendgrid.
    });

    const response = await this.sgApi.API(request);
    return response;
  }
}

module.exports = Mailer;
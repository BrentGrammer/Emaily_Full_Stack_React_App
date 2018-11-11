const keys = require('../../config/keys');

// define html content of any email sent by the app:
// the args passed in include the survey from the req.body sent from client to use in email.

// the href for the anchors will be the localhost domain in development and your app base domain url in production.
module.exports = (survey) => {
  return `
    <html>
      <body>
        <div style="text-align: center;">
          <h3>I'd Like your Input!</h3>
          <p>Please answer the following question:</p>
          <p>${survey.body}</p>
          <div>
            <a href="${keys.redirectDomain}/api/surveys/thanks">Yes</a>
            <a href="${keys.redirectDomain}/api/surveys/thanks">No</a>
          </div>
        </div>
      </body>
    </html>
  `;
};
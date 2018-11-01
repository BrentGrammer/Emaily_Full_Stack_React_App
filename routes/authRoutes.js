
const passport = require('passport');

module.exports = (app) => {
  // Note: 'google' is setup by GoogleStrategy when you registered it with .use().  Passport will refer to the Google Strategy
  // when it sees the string 'google' passed in as the first arg.
  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }))

  // Handle callback route after user grants permission.
  // Google strategy will see the code in the URL query param sent by Google and will handle the request appropriately to get 
  // user info.
  app.get('/auth/google/callback', passport.authenticate('google'));

  // logout handler endpoint:
  // passport attaches a logout function to the request object which deletes the cookie and unauthenticates the user.
  app.get('/api/logout', (req, res) => {
    req.logout();
    // send back req.user to show that the user is no longer signed in (it will return undefined, null no content etc.):
    res.send(req.user);
  });

  // create a route to handle returning the currently logged in user.  req.user will be defined and set by the passport cookie 
  // based authentication process.  
  // You can use this route to test to see if authentication is working based on if you get the req.user object back.
  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
};
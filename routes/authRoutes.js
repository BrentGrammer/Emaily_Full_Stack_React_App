
const passport = require('passport');

module.exports = (app) => {
  // Note: 'google' is setup by GoogleStrategy when you registered it with .use().  Passport will refer to the Google Strategy
  // when it sees the string 'google' passed in as the first arg and start the OAuth flow to get the user logged in with google.
  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }))

  /**
   * passport.authenticate() is a middleware which takes the incoming request sent by google after user grants permission.
   * It takes the code from the url injected by google to further authenticate the user and fetches the user profile.
   * Finally it calls the callback defined in the Google Strategy instance in /services/passport.js which takes the user 
   * profile object returned and stores it in the database if new user and returns it to the client for use.
   * 
   * You need to define a route handler as the third argument to tell Express what to do with the request after the
   * Google/passport authentication process is complete.  You can use the res.redirect() function to send the user to an 
   * appropriate route after logging in in the app.
   */
  // Handle callback route after user grants permission.
  // Google strategy will see the code in the URL query param sent by Google and will handle the request appropriately to get 
  // user info.
  app.get(
    '/auth/google/callback', 
    passport.authenticate('google'), 
    (req, res) => {
      res.redirect('/surveys');
    }
  );

  // logout handler endpoint:
  // passport attaches a logout function to the request object which deletes the cookie and unauthenticates the user from 
  // google using the strategy.
  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  // create a route to handle returning the currently logged in user.  req.user will be defined and set by the passport cookie 
  // based authentication process.  
  // You can use this route to see if the user is signed in to determine what to show on the client side 
  // based on if you get the req.user object back (if not logged in it will be undefined or an empty string).
  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
};
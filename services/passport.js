// import passport and the strategy for the provider:
const passport = require('passport');
const mongoose = require('mongoose');
// attach .Strategy to the require call since that is the main method you will be using.
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');

// This pulls the user collection for access by providing only one arg to mongoose.model()
// (This is a model class which represents a collection)
const User = mongoose.model('users');

/* This generates a cookie token to identify user - takes 2 args - the user model and the done fn:
   the user arg passed in is the same user resulting from the GoogleStrategy callback when creating or finding a user in the db.
   
   This will make passport automatically set the cookie in the response header to the client which then stores it in the 
   browser and sends it with all subsequent requests. */
passport.serializeUser((user, done) => {
  // pass in null for the error object, and the id of the record (not the google id) in the database for the user.
  done(null, user.id);
});

/*
This passport method checks the incoming request headers for the cookie set by serializeUser and uses it to find a matching 
user record in the database.
  deserializeUser() takes the token from the cookie on the request as the first arg.  Second arg is done which you call
  once you have successfully translated the cookie token to a user model.
 This puts the user model returned on the req.user property for the received request where it can be accessed.
*/
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => {
      done(null, user);
    });
});

/* 
 Hook up passport to the strategy - this registers the strategy with passport:
 takes 3 options: the keys and the callback url to send user after they grant permission to sign in with google.

 Finally there is a callback function passed in which runs after a response from Google is received from sending them the 
 code in the followup request after the user grants permission.  This is where you can create a record in the database for 
 a new user.
*/
passport.use(new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback' // you can specify whatever route you want
    }, 
    (accessToken, refreshToken, profile, done) => {
      // This is where you can take the user information and save it to the database.  

      // Check if user exists in the db - will return null result if no record is found:
      User.findOne({ googleId: profile.id })
        .then((existingUser) => {
          if (existingUser) {
            // user exists in db - call done() to tell passport to move on. takes 2 args - err object and the user record created or found.
            // note that the error object will be defined and set by you for a condition that you expect to encounter an error in.
            done(null, existingUser);
          } else {
            // user is new and was not found in db         
            // Create a model instance using the model class for the record to be stored and save the model instance to the database with .save():
            new User({ googleId: profile.id }).save()
              .then((user) => {
                done(null, user);
              });
          }
        });  
    }
  )
);
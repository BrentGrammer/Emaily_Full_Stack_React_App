const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
// This runs the model class file and creates the collection in the database.
// Note: make sure that the schema models are loaded before the passport file or files that need to use the model class:
require('./models/User');
// This simply runs the code in the passport file (nothing is exported there).
require('./services/passport');

mongoose.connect(keys.mongoURI);

const app = express();

/** COOKIE MIDDLEWARES FOR AUTHENTICATION **/

// maxage is how long the cookie lasts til expiring, and keys are used to encrypt the cookie
// this middleware assigns the cookie data from the request to a req.session property which passport looks at to get it.
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey] // if multiple keys, one will be selected randomly.
  })
);
// Tell passport to use cookies to handle authentication:
app.use(passport.initialize());
app.use(passport.session());

// Auth routes with app passed in
require('./routes/authRoutes')(app);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('listening on port ', PORT);
});
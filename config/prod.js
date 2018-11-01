// These are set by Heroku.  By convention use caps and underscores for the variable names.
// this file needs to be committed to git for heroku to access.

module.exports = {
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  mongoURI: process.env.MONGO_URI,
  cookieKey: process.env.COOKIE_KEY
}
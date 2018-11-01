// determine what set of credentials to return.

if (process.env.NODE_ENV === 'production') {
  // return/export prod keys
  module.exports = require('./prod');
} else {
  // return and export development mode keys
  module.exports = require('./dev');
}
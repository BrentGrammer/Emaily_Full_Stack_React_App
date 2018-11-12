// REQUIRED TO USE A PROXY IN CREATE-REACT-APP 2.0 - see notes for method on using proxy with CRA 1.x
// This is added to allow for using relative paths to back end server endpoints in front end code (since they would normally
// point towards the root domain created by CRA which is a different port than the back end server)

const proxy = require('http-proxy-middleware')
 
module.exports = function(app) {
  // this tells the react server to proxy requests to the auth/google endpoint through the back end server domain 
  // (at port 5000 instead of 3000 on the client).  This allows the use of relative paths in the code to backend endpoints.
  app.use(proxy('/auth/google', { target: 'http://localhost:5000' }));
  app.use(proxy('/api', { target: 'http://localhost:5000' }));
};
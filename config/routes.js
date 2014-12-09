// Draw routes.  Locomotive's router provides expressive syntax for drawing
// routes, including support for resourceful routes, namespaces, and nesting.
// MVC routes can be mapped to controllers using convenient
// `controller#action` shorthand.  Standard middleware in the form of
// `function(req, res, next)` is also fully supported.  Consult the Locomotive
// Guide on [routing](http://locomotivejs.org/guide/routing.html) for additional
// information.

var fb = require(process.cwd() + '/lib/fb.js');

module.exports = function routes() {
  
  this.get('/hltv', 'pages#hltv');
  this.post('/show', 'pages#show');
  this.get('/match/?(:id)?', 'pages#match');
  this.get('/history', 'pages#history');
  
  
  this.get('/', 'pages#main');
  this.post('/stats', 'pages#stats');
  this.get('/:user', 'pages#profile');
  
  
  
  //this.get('/auth/facebook', fb.redirect);
  //this.get('/auth/facebook/callback', fb.login);
}

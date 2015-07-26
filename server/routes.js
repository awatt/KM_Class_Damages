/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/results', require('./api/result'));
  app.use('/api/totals', require('./api/total'));
  app.use('/api/duras', require('./api/dura'));
  app.use('/api/endholdings', require('./api/endholding'));
  app.use('/api/begholdings', require('./api/begholding'));
  app.use('/api/buys', require('./api/buy'));
  app.use('/api/sales', require('./api/sale'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));
  
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};

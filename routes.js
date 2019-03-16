var express = require('express');
var flightRoute = require('./routes/flightRoute.js');
var config = require('./config');

// register route controllers
module.exports = function(app) {
  var flightDash = require('./models/flight.js')(app);
  var flight = require('./models/derp.js')(app);


  app.set('flight', flightDash);
  app.set('derpDash', derpDash);
  app.get('/api/flights', flightRoute.allFlights);
};

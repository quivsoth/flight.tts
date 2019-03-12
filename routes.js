var express = require('express');
var flightRoute = require('./routes/flightRoute.js');

// register route controllers
module.exports = function(app) {
  var flight = require('./models/flight.js')(app);
  app.set('flight', flight);
  app.get('/api/flights', flightRoute.allFlights);
};

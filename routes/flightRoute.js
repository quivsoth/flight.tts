module.exports = {
  allFlights: function(req, res) {
    var flight = req.app.get('flight');
    var Enum = require('enum');
    var status = new Enum({
      'A': 'Active',
      'C': 'Cancelled',
      'D': 'Diverted',
      'DN': 'Data Source Needed',
      'L': 'Landed',
      'NO': 'Not Operational',
      'R': 'Redirected',
      'S': 'Scheduled',
      'U': 'Unknown'
    });
    flight.find({}, (err, flights) => {
      for (var i = 0; i < flights.length; i++) {
        flights[i].status = status.get(flights[i].status).value;
      }
      res.send(flights);
    });
  }
}

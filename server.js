//var broadcast = require("./broadcast.js");
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose'), Schema = mongoose.Schema;
//var flightListenerApi = require('./listeners/flightApiListener.js');

run().catch(error => console.error(error));

async function run() {
//  console.clear();
  console.log(new Date(), 'Started Flight API Server');
  var args = process.argv.slice(2);
  if (args == "drop") {
    console.log('trying to drop');
    flightListenerApi.drop();
    //process.exit();
  } else if(args == "build") {
    flightListenerApi.build();
    //process.exit();
  } else if(args == "run") {
    setInterval(flightListenerApi.getActiveFlights, 6000, 'getActiveFlights');
    //process.exit();
  }

  app.use(express.static(__dirname));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.set('socketio', io);

  // Configuration
  var config = require('./config');

  // Database
  require('./database.js')(config);

  // Routes
  require('./routes')(app, io);

  var server = http.listen(config.webserviceport, () => {
    console.log('Server running on port:', server.address().port);
  });

  // Flight listeners for Google Home
  require('./listeners/flightListener.js');

  module.exports = server;
}

// io.on('connection', () => {
//   // console.log("Connected.");
// });

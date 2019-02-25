var broadcast = require("./broadcast.js");
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var request = require("request");

console.log('Flight API Server (Express JS), created: ' + Date.now());



// module.exports = server 
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

var dbUrl = 'mongodb://localhost:27017,localhost:27018,localhost:27019/' +
    'node-demo?replicaSet=mongo-repl';

var flightSchema = new mongoose.Schema({
    flightNumber: String,
    from: String,
    time: String,
    status: String,
    terminal: String,
    gate: String
});

var Flight = mongoose.model('Flight', flightSchema);

function dataChanged(data){
    io.emit('onDataChanged', data.fullDocument);
    //console.log(data.fullDocument.flightNumber);
    var message = "Flight number " + data.fullDocument.flightNumber + " from " + data.fullDocument.from;

    // find the value that changed - using JSDIFF
    // if the time changed say "has a new ETA which is : "
    // if the terminal has changed say "has has changed to a new gate. The new gate is now gate : "
    // if the terminal has changed say "has has changed to a new terminal. The new terminal is at : "
    // if the status has changed
    // Departed : The fight has departed
    // Arrived: The flight has arrived
    // Cancelled: the flight has been cancelled
    // On Time: The flight is on time
    // On Time: The flight is delayed


    var sender = broadcast.Send(message, "en-US");
} 

Flight.watch().on('change', data =>
    dataChanged(data)
    //console.log(data.fullDocument)
);

app.get('/api/flights', (req, res) => {
    Flight.find({}, (err, flights) => {
        res.send(flights);
    })
});

io.on('connection', () => {
    console.log("User connected.");
});

// Connectors
mongoose.connect(dbUrl, { useNewUrlParser: true }, () => {
    console.log('MongoDB connected!');
});

var server = http.listen(3000, () => {
    console.log('server is running on port', server.address().port);
});

module.exports = server;
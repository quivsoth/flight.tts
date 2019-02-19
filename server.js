var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var dbUrl = 'mongodb://localhost:27017,localhost:27018,localhost:27019/' +
    'node-demo?replicaSet=mongo-repl';

var flightSchema = new mongoose.Schema({
    flightNumber: String,
    from: String,
    to: String
});
var Flight = mongoose.model('Flight', flightSchema);

Flight.watch().on('change', data => 
        io.emit('onDataChanged', data.fullDocument)
        //console.log(data.fullDocument)
    );

app.get('/flights', (req, res) => {
    Flight.find({}, (err, flights) => {
        res.send(flights);
    })
});

io.on('connection', () => {
    console.log("User connected.");
});

mongoose.connect(dbUrl, { useMongoClient: true }, (err) => {
    console.log('MongoDB connected!');
});

var server = http.listen(3000, () => {
    console.log('server is running on port', server.address().port);
});
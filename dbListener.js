var MongoClient = require('mongodb').MongoClient;
var request = require("request");
var jsonQuery = require('json-query');
var diff = require('deep-diff').diff;
var broadcast = require("./broadcast.js");

//------

run().catch(error => console.error(error));

async function run() {
  //console.clear();
  //console.log(new Date(), 'start');
  const uri = 'mongodb://localhost:27017,localhost:27018,localhost:27019/techops?replicaSet=rs0';
  const client = await MongoClient.connect(uri, { useNewUrlParser: true });
  const db = client.db('node-demo');

  // Create a change stream. The 'change' event gets emitted when there's a change in the database
  db.collection('flights').watch().on('change', data => compareFlightChanges(data));
  refresh();


  function refresh() {
    var url = "http://localhost:3000/api/flights";
    request({
      url: url,
      json: true
    }, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        rs = body;
      } else {
        console.log(error);
      }
    });
  }

  function compareFlightChanges(data) {
    //var result = jsonQuery('[*_id=5c58c286e0ceb31c96458743]', {
    var currentRecord = jsonQuery('[*_id=' + data.fullDocument._id + ']', {
      data: rs
    }).value;
    var differences = diff(currentRecord[0], data.fullDocument);

    if (differences) {
      //console.log(differences);
      buildMessage(currentRecord[0], differences);
    }
    refresh();
  }

  function buildMessage(currentRecord, differences) {
    var message = 'Flight Notification for AA' + currentRecord.flightNumber + ': ';
    for (var i = 1; i < differences.length; i++) {
      switch (JSON.stringify(differences[i].path)) {
        case '["flightNumber"]':
          message += 'Flight Number has changed from AA' + differences[i].lhs + ' to AA' + differences[i].rhs + '. ';
          break;
        case '["from"]':
          message += (i == 1 ? '' : (differences.length > 2 ? "Also, " : "")) + 'Location changed from ' + differences[i].lhs + ' to ' + differences[i].rhs + '. ';
          break;
        case '["time"]':
          message += (i == 1 ? '' : (differences.length > 2 ? "Also, " : "")) + 'Time has changed from ' + differences[i].lhs + ' to ' + differences[i].rhs + '. ';
          break;
        case '["status"]':
          message += 'flight Status has changed to ' + differences[i].rhs + '. ';
          break;
        case '["terminal"]':
          message += (i == 1 ? '' : (differences.length > 2 ? "Also, " : "")) +
            'Termimnal has changed from ' + currentRecord.terminal + currentRecord.gate +
            ' to ' + differences[i].rhs + currentRecord.gate + '. ';
          break;
        case '["gate"]':
          message += (i == 1 ? '' : (differences.length > 2 ? "Also, " : "")) +
            'Gate has changed from ' + currentRecord.terminal + differences[i].lhs +
            ' to ' + currentRecord.terminal + differences[i].rhs + '. ';
          break;
        default:
          // code block
      }
    }
    //console.log(message);
    var sender = broadcast.Send(message, "en-US");
    return message;
  }
}

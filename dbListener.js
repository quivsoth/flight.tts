var MongoClient = require('mongodb').MongoClient;
var request = require("request");
var jsonQuery = require('json-query');
var diff = require('deep-diff').diff;
var broadcast = require("./broadcast.js");
var config = require('./config');

//------

run().catch(error => console.error(error));

async function run() {
  // console.clear();
  console.log(new Date(), 'start');
  const pipeline = [
    {
      $project: { documentKey: false }
    }
  ];
  MongoClient.connect(config.database)
    .then(client => {
      console.log("Connected correctly to server");
      // specify db and collections
      const db = client.db("techops");
      const collection = db.collection("flights");
      const changeStream = collection.watch(pipeline, { fullDocument: 'updateLookup' });

      // start listen to changes
      changeStream.on("change", function(data) {
        //console.log("full document : " + data.fullDocument);
        compareFlightChanges(data);
        // compareFlightChanges();
      });
    })
    .catch(err => {
      console.error(err);
  });
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
    // var result = jsonQuery('[*_id=5c58c286e0ceb31c96458743]', {
    var currentRecord = jsonQuery('[*_id=' + data.fullDocument._id + ']', {
      data: rs
    }).value;
    var differences = diff(currentRecord[0], data.fullDocument);
    if (differences) buildMessage(currentRecord[0], differences);
    refresh();
  }

  function buildMessage(currentRecord, differences) {

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

    var message = 'Flight Notification for AA' + currentRecord.flightNumber + ': ';
    for (var i = 1; i < differences.length; i++) {
      switch (JSON.stringify(differences[i].path)) {
        case '["flightNumber"]':
          console.log("lhs : " + differences[i].lhs);
          console.log("rhs : " + differences[i].rhs);
          if (parseInt(differences[i].lhs != differences[i].rhs)) {
            message += 'Flight Number has changed from AA' + differences[i].lhs + ' to AA' + differences[i].rhs + '. ';
          }
          break;
        case '["from"]':
          message += (i == 1 ? '' : (differences.length > 2 ? "Also, " : "")) + 'Location changed from ' + differences[i].lhs + ' to ' + differences[i].rhs + '. ';
          break;
        case '["time"]':
          message += (i == 1 ? '' : (differences.length > 2 ? "Also, " : "")) + 'Time has changed from ' + differences[i].lhs + ' to ' + differences[i].rhs + '. ';
          break;
        case '["status"]':
          message += 'flight Status has changed to ' + status.get(differences[i].rhs).value + '. ';
          break;
        case '["terminal"]':
          message += (i == 1 ? '' : (differences.length > 2 ? "Also, " : "")) +
            'Terminal has changed from ' + currentRecord.terminal + currentRecord.gate +
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

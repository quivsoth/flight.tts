var assert = require('assert');
var config = require('../config');
var flightListener = require('../listeners/flightListener.js');

var MongoClient = require('mongodb').MongoClient;


describe.only('Query API for flight data', function() {
  it('should read a flight based on the flightId', function(done) {
    // TODO diff out all the API variables
     this.timeout(0);
    setInterval(compareFlights, 4000, 'getActiveFlights');

    function compareFlights() {
      var fs = require('fs');
      fs.readFile('./flight_sample.json', 'utf8', function(err, contents) {

        var body = JSON.parse(contents);

            // console.log(body.flightStatus.status);
        MongoClient.connect(config.database, function(err, db) {
          if (err) throw err;
          var dbo = db.db("techops");
          var query = {
            flightId: 992822725
          };
          dbo.collection("flights").findOne(query).then(function(doc) {
            if (body.flightStatus.status !== doc.status) {
              //   // somethings changed
              console.log('Changed');
              console.log('From live site flight num: ' + body.flightStatus.flightNumber);
              console.log('From live site status: ' + body.flightStatus.status + "\n\n");
              console.log('Local Record : ' + doc.flightNumber);
              console.log('Local Status : ' + doc.status);
              //module.exports.update(body);
            }
            db.close();
            //done();
          }); //dbo collection
        }); //mongo connect
      }); //fs readfile
    }; //blastme
  }); //it should
}); //describes

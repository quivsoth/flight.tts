
var config = require('./config');
var MongoClient = require('mongodb').MongoClient;


var url = "mongodb://localhost:27017,localhost:27018,localhost:27019/techops?replicaSet=rs0";
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("techops");
  if (err) {
    throw err;
  } else {

    // Modify and return the modified document
    var collection = dbo.collection("flights");
    collection.findOneAndUpdate({
      flightId: 992825859
    }, {
      $set: {
        status: "A",
        gate: "4"
      }
    }, {
      returnOriginal: true,
      upsert: false
    }, function(err, doc) {
      // assert.equal(null, err);
      // assert.equal(1, r.value.b);
      //console.log(err);
    });
  }
});

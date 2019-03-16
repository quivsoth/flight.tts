var assert = require('assert');
var config = require('../config');
var derp = require('../listeners/derpListener.js');

var MongoClient = require('mongodb').MongoClient;


describe.only('DERP tests', function(done) {
  it('should build a database/collection and add a record', function(done) {
    var derpCollection = [];
    var sample_data1 = { derpId : 3, appName : "JMOCA", startTime : "01:33 pm", endTime : "09:14pm", severity: 4, slackChannel : "#ops-inc-741769" }
    //derpCollection.push(sample_data1);
    //derp.build(derpCollection);
    done();
  });

  it('should retrieve all DERPS', function(done) {
    var collection = derp.read(4, function(result) {
       assert.equal((result.length > 0), true);
    });
    done();
  });

  it('should speak to the home device', function(done) {
    derp.speak(1);
    done();
  });

});

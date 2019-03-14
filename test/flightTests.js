var assert = require('assert');
var config = require('../config');
var flightListener = require('../flightListener.js');



describe.only('Update a record in Mongo', function() {
  it('should read a record in MongoDB', function(done) {
    // var doc = {
    //   flightId: 992719520,
    //   status: "X"
    // }
    // flightListener.update(doc);
    // done();


    flightListener.reader();
    done();
  });
});

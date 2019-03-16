var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// model of derp (uses mongoose)
module.exports = function(app) {
  var io = app.get('socketio');
  var derpSchema = new mongoose.Schema({
    derpId: Number,
    appName: String,
    startTime: String,
    endTime: String,
    severity: String,
    slackChannel: String
  });

  var derp = mongoose.model('derp', derpSchema);

  derp.watch(null, { fullDocument: "updateLookup" }).on('change', data =>
    io.emit('onDerpInserted', data.fullDocument)
  );
  return derp;
};

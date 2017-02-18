var flock = require('flockos');
var config = require('./config.js');
var express = require('express');
var _ = require('lodash');
var request = require("request");
var mongodb   = require('mongodb');
var mongoose  = require('mongoose');
var db        = mongoose.connect('mongodb://localhost:27017/confession');

flock.appId = config.appId;
flock.appSecret = config.appSecret;
var app = express();
app.use(flock.events.tokenVerifier);
app.post('/events', flock.events.listener);
app.listen(8080, function() {
    console.log('listening on 8080');
})

flock.events.on('app.install', function(event, callback) {
  console.log(event.token);
  callback('here you go.');
  request.post({
      url: 'https://api.flock.co/v1/users.getInfo',
      form:{
        token:event.token
      }
  }, function(err, http, body) {
      // if (body) {
      //     body = JSON.parse(body);
      // }
      if (err) {
          console.log('Some error occurred');
      } else if (!_.isEmpty(body)) {

      } else {
        console.log("user token isn't valid")
      }
  });
});

flock.events.on('client.slashCommand', function(event, callback) {
    // handle slash command event here
    // ...
    // invoke the callback to send a response to the event
    // console.log(event);
    callback(null, {
        text: 'Received your command'
    });
});

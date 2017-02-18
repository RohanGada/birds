var flock = require('flockos');
var config = require('./config.js');
var express = require('express');
var _ = require('lodash');
var request = require("request");
var chrono = require('chrono-node')
// DB connection
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost:27017/company', function(err, data) {
    if (err) {
        console.log(err);
    } else {
        console.log("Database Connected to HR.");
    }
});
var User = require('./models/User');
// DB connection end

// Flock Credentials
flock.appId = config.appId;
flock.appSecret = config.appSecret;
// Flock Credentials end



//Express setup
var app = express();
app.use(flock.events.tokenVerifier);
app.post('/events', flock.events.listener);
// app.get('/render', function(event, callback) {
//     console.log("Ye le teri event")
// });
app.listen(8080, function() {
    console.log('listening on 8080');
});
//Express setup end


flock.events.on('app.install', function(event, callback) {
    // console.log(event.token);
    callback();

    setTimeout(function() {
        request.post({
            url: 'https://api.flock.co/v1/users.getInfo',
            form: {
                token: event.token
            }
        }, function(err, http, body) {
            if (err) {
                console.log('Some error occurred');
            } else if (!_.isEmpty(body)) {
              console.log(body);
                User.saveData(JSON.parse(body), function(err, data) {
                    if (err) {
                        console.warn(err);
                    } else {
                        console.warn('User saved successfully');
                    }
                });
            } else {
                console.log("user token isn't valid")
            }
        });
    }, 2000);
});

flock.events.on('app.uninstall', function(event, callback) {
    User.deleteDataByFlockUserId(event, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback('User deleted successfully');
        }
    });
});
// flock.events.on('/render', function(event, callback) {
//     console.log('calendar');
// });
var parseDate = function (text) {
  var d = chrono.parseDate(text);
  if(d){
      return d;
  }else{
    return null;
  }
};
flock.events.on('client.slashCommand', function(event, callback) {
    if(event && event.text){
      // console.log(event.text.indexOf('"'));
      var reason = event.text.substring(event.text.indexOf('\"')+1,event.text.lastIndexOf('\"'));
      // console.log(reason);
      // console.log(event.text);
      var dates = event.text.toLowerCase().substring(event.text.lastIndexOf('\"'));
      if(dates.indexOf('to') == -1){
        console.log(parseDate(dates[0]));
      }else{
        var strArr = dates.split('to');
        var hasFrom = strArr[0];
        var hasTo = strArr[1];
        console.log(parseDate(hasFrom));
        console.log(parseDate(hasTo));
      }
    }
    callback(null, {
        text: 'Received your command'
    });
});

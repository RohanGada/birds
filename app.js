var flock = require('flockos');
var config = require('./config.js');
flock.appId = config.appId;
flock.appSecret = config.secret;
flock.events.verifyToken();

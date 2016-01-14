var twitter = require('twitter');
var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
// var util = require('util');
// var debug = require('debug')('explorer');


exports.index = function (http) {
    io = io(http);
    return function (req, res) {
        res.render('index', {title: 'Express'});
        if (req.session.oauth) {
            InitStream(req.session);
        }
    };
};



// var twit = new twitter({
  // consumer_key: process.env.TWITTER_KEY,
  // consumer_secret: process.env.TWITTER_SECRET,
  // access_token_key: process.env.ACCESS_TOKEN_KEY,
  // access_token_secret: process.env.ACCESS_TOKEN_SECRET
// }),

// stream = null;

// io.sockets.on('connection', function (socket) {
//   socket.on("start tweets", function(){
//     if(stream === null) {
//       twit.stream('statuses/filter.json', {track: "trump"}, function (stream) {
//         stream.on('data', function (data) {
//           // if (data.user) {
//           //     debug(data.user.screen_name + " : " + data.text);
//           // } else {
//           //     debug(data);
//           // }
//           io.sockets.emit('newTwitt', data);
//           console.log(data);
//           // throw  new Exception('end');
//       });
//     });
//   }
// });
// });


var isActive = false;
var InitStream = function (session) {
    var twit = new twitter({
      consumer_key: process.env.TWITTER_KEY,
      consumer_secret: process.env.TWITTER_SECRET,
      access_token_key: process.env.ACCESS_TOKEN_KEY,
      access_token_secret: process.env.ACCESS_TOKEN_SECRET
        // consumer_key: "A6x1nzmmmerCCmVN8zTgew",
        // consumer_secret: "oOMuBkeqXLqoJkSklhpTrsvuZXo9VowyABS8EkAUw",
        // access_token_key: session.oauth.access_token,
        // access_token_secret: session.oauth.access_token_secret
    });

    if (!isActive) {
        debug('init Stream');


        twit.stream(
            'statuses/filter.json',
            {track: "trump"}, 
            function (stream) {
                stream.on('data', function (data) {
                    if (data.user) {
                        debug(data.user.screen_name + " : " + data.text);
                    } else {
                        debug(data);
                    }
                    io.sockets.emit('newTwitt', data);
                    // console.log(data);
                    // throw  new Exception('end');
                });
                stream.on('end', function (b) {
                    debug('end stream', arguments);
                    isActive = false;
                    InitStream(session);
                });
                stream.on('destroy', function (b) {
                    debug('destroy stream', b.toString());
                    isActive = false;
                    InitStream(session);
                });
            }
        );
        isActive = true;
    }
};


module.exports = {
  users: require("./users"),
  auth: require("./auth")
};
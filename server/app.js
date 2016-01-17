require("dotenv").load();

var express = require("express");
var app = express();
var morgan = require("morgan");
var bodyParser = require("body-parser");
var routes = require('./routes');
var server = require('http').Server(app);
var path = require("path");
var io = require('socket.io')(server);
// var twitter = require('./routes/index');
var Twit = require('twit');
    
// exports.io = io;

app.use(morgan("tiny"));
app.use(bodyParser.json());

app.use('/css',express.static(path.join(__dirname, '../client/css')));
app.use('/js',express.static(path.join(__dirname, '../client/js')));
app.use('/templates',express.static(path.join(__dirname, '../client/js/templates')));

app.use('/api/users', routes.users);
app.use('/api/auth', routes.auth);

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

var T = new Twit({
  consumer_key: 'K4PINYh5lq7G28ShJHfBAv3Vu',
  consumer_secret: 'TVhzbiyjG1xTbLuCPqmQXX9G0a6YDMLDNRgXJ6N8pI8OTnfMgC',
  access_token: '539671341-TtEPR4CtsnlM6e2IE8Sxs2UZcUcgia1v1iPBuMTo',
  access_token_secret: '18QXSWiPr1pv1BWq0sShJ91BfMVOuo3FO9jLZ7nOstYsj'
});

// Sockets
io.on('connection', function(socket) {
  //create empty socket.id object within searches
  searches[socket.id] = {};
  socket.on('q', function(q) {

    if (!searches[socket.id][q]) {
      console.log('New Search >>', q);

      var stream = T.stream('statuses/filter', {
        track: q
      });

      stream.on('tweet', function(tweet) {
        console.log(q, tweet.id);
        socket.emit('tweet_' + q, tweet);
      });

      stream.on('limit', function(limitMessage) {
        console.log('Limit for User : ' + socket.id + ' on query ' + q + ' has reached!');
      });

      stream.on('warning', function(warning) {
        console.log('warning', warning);
      });

      // https://dev.twitter.com/streaming/overview/connecting
      stream.on('reconnect', function(request, response, connectInterval) {
        console.log('reconnect :: connectInterval', connectInterval);
      });

      stream.on('disconnect', function(disconnectMessage) {
        console.log('disconnect', disconnectMessage);
      });

      searches[socket.id][q] = stream;
    }
  });

  socket.on('remove', function(q) {
    searches[socket.id][q].stop();
    delete searches[socket.id][q];
    console.log('Removed Search >>', q);
  });

  socket.on('disconnect', function() {
    for (var k in searches[socket.id]) {
      searches[socket.id][k].stop();
      delete searches[socket.id][k];
    }
    delete searches[socket.id];
    console.log('Removed All Search from user >>', socket.id);
  });

});

server.listen(3000);
console.log('Server listening on port 3000');


// var express = require('express');
// var app = express();
// var server = require('http').Server(app);
// var path = require('path');
// var io = require('socket.io')(server);
// var Twit = require('twit');
// var searches = {};

// var T = new Twit({
//   consumer_key: 'K4PINYh5lq7G28ShJHfBAv3Vu',
//   consumer_secret: 'TVhzbiyjG1xTbLuCPqmQXX9G0a6YDMLDNRgXJ6N8pI8OTnfMgC',
//   access_token: '539671341-TtEPR4CtsnlM6e2IE8Sxs2UZcUcgia1v1iPBuMTo',
//   access_token_secret: '18QXSWiPr1pv1BWq0sShJ91BfMVOuo3FO9jLZ7nOstYsj'
// });

// // app.use(express.static(path.join(__dirname, 'public')));

// // app.get('/', function(req, res) {
// //   res.sendFile(__dirname + '/index.html');
// // });

// // Sockets
// io.on('connection', function(socket) {
//   //create empty socket.id object within searches
//   searches[socket.id] = {};
//   socket.on('q', function(q) {

//     if (!searches[socket.id][q]) {
//       console.log('New Search >>', q);

//       var stream = T.stream('statuses/filter', {
//         track: q
//       });

//       stream.on('tweet', function(tweet) {
//         console.log(q, tweet.id);
//         socket.emit('tweet_' + q, tweet);
//       });

//       stream.on('limit', function(limitMessage) {
//         console.log('Limit for User : ' + socket.id + ' on query ' + q + ' has rechead!');
//       });

//       stream.on('warning', function(warning) {
//         console.log('warning', warning);
//       });

//       // https://dev.twitter.com/streaming/overview/connecting
//       stream.on('reconnect', function(request, response, connectInterval) {
//         console.log('reconnect :: connectInterval', connectInterval);
//       });

//       stream.on('disconnect', function(disconnectMessage) {
//         console.log('disconnect', disconnectMessage);
//       });

//       searches[socket.id][q] = stream;
//     }
//   });

//   socket.on('remove', function(q) {
//     searches[socket.id][q].stop();
//     delete searches[socket.id][q];
//     console.log('Removed Search >>', q);
//   });

//   socket.on('disconnect', function() {
//     for (var k in searches[socket.id]) {
//       searches[socket.id][k].stop();
//       delete searches[socket.id][k];
//     }
//     delete searches[socket.id];
//     console.log('Removed All Search from user >>', socket.id);
//   });

// });

// server.listen(3000);
// console.log('Server listening on port 3000');

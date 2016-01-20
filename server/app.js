require("dotenv").load();

var express = require("express");
var app = express();
var morgan = require("morgan");
var bodyParser = require("body-parser");
var routes = require('./routes');
var server = require('http').Server(app);
var path = require("path");
var io = require('socket.io')(server);
var Twit = require('twit');
var fs = require('fs');

// fs.readFile('server/AFINN-111.txt','utf8',(err, data) => {
//   if (err) throw err;
//   // data = data.split();
//       // .reduce(function(m,i){
//         // var s = i.split(':');
//         // m[s.shift()] = s.join(':');
//         // return m;
  


//   console.log(data);
// });

// console.log(JSON.stringify(array));
// for(i in array) {
    // console.log(array[i]);

// }

// data2 = data2.split(/\r?\n/).reduce(function(m,i){
//     var s = i.split(':');
//     m[s.shift()] = s.join(':');
//     return m;
// }, {});

// JSON.stringify(data2);

app.use(morgan("tiny"));
app.use(bodyParser.json());

app.use('/css',express.static(path.join(__dirname, '../client/css')));
app.use('/js',express.static(path.join(__dirname, '../client/js')));
app.use('/bower_components',express.static(path.join(__dirname, '../client/bower_components')));
app.use('/templates',express.static(path.join(__dirname, '../client/js/templates')));

app.use('/api/users', routes.users);
app.use('/api/auth', routes.auth);

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

var T = new Twit({
  consumer_key: process.env.TWITTER_KEY,
  consumer_secret: process.env.TWITTER_SECRET,
  access_token: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});


var array = fs.readFileSync('server/lib/AFINN-111.txt', 'utf8').replace(/\t/g, ' ').split('\n');
var posArray = fs.readFileSync('server/lib/POS.txt', 'utf8').split('\n');
var negArray = fs.readFileSync('server/lib/NEG.txt', 'utf8').split('\n');
// console.log(posArray);

var scoreObj = {};

array.forEach(function(word) {
  var split = word.split(' ');
  scoreObj[split[0]] = Number(split[1]); 
});
// console.log(scoreObj);

// SOCKET.IO LOGIC
io.on('connection', function(socket) {
  console.log('connected!!!!!!!');

  socket.on('keyword', function(keyword) {

    var stream = T.stream('statuses/filter', {
      track: keyword
    });

    stream.on('tweet', function(tweet) {
      // console.log(keyword, tweet.id);
      tweet.score = 0;
      tweet.time = Date.now();
      // console.log(tweet.text.toLowerCase());
      
      // var t = tweet.text.toLowerCase();

      tweet.text.toLowerCase().split(' ').reduce(function(prev, cur){
        tweet.score = prev + (scoreObj[cur] ? scoreObj[cur] : 0);

        return tweet.score;
      },0);

      // tweet.text.toLowerCase().split(' ').forEach(function(val, i, arr){

      // });
      
      socket.emit('tweet', tweet);
      console.log(tweet.score, tweet.time, tweet.created_at);
      //split tweet into array of words
      //helper function to calculate score
    });

    // var scoreObjs = {love: 1, hate: -1};

    // var tweet = "love love love love hate hate";

    // tweet.split(" ").reduce(function(prev, cur) {

    //   return prev + (scoreObjs[cur] ? scoreObjs[cur] : 0);

    // },0);

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
      stream.stop();
    });

  });

  // socket.on('remove', function(q) {
  //   searches[socket.id][q].stop();
  //   delete searches[socket.id][q];
  //   console.log('Removed Search >>', q);
  // });

  // socket.on('disconnect', function() {
  //   for (var k in searches[socket.id]) {
  //     searches[socket.id][k].stop();
  //     delete searches[socket.id][k];
  //   }
  //   delete searches[socket.id];
  //   console.log('Removed All Search from user >>', socket.id);
  // });

});

server.listen(3000);
console.log('Server listening on port 3000');


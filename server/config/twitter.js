// var Twit = require('twit');
// var io = require('../app').io; //THIS PROBABLY NEEDS TO BE FIXED
// var TWEETS_BUFFER_SIZE = 3;
// var SOCKETIO_TWEETS_EVENT = 'tweet-io:tweets';
// var SOCKETIO_START_EVENT = 'tweet-io:start';
// var SOCKETIO_STOP_EVENT = 'tweet-io:stop';
// var openSockets = 0;
// var isFirstTwitterConnection = true;

// console.log('twitter');

// var T = new Twit({
//   consumer_key: process.env.TWITTER_KEY,
//   consumer_secret: process.env.TWITTER_SECRET,
//   access_token: process.env.ACCESS_TOKEN_KEY,
//   access_token_secret: process.env.ACCESS_TOKEN_SECRET
// });

// console.log('listening for tweets');

// var stream = T.stream('statuses/filter', { track: 'trump' });
// var tweetsBuffer = [];
// var oldTweetsBuffer = [];

// //SOCKET.IO EVENTS
// var discardClient = function(){
//   console.log('client disconnected');
//   openSockets--;

//   if(openSockets <= 0){
//     openSockets = 0;
//     console.log('no active client. stop streaming tweets');
//     stream.stop();
//   }
// };

// var handleClient = function(data, socket){
//   if(data === true){
//     console.log('client connected');

//     if(openSockets <= 0){
//       openSockets = 0;
//       console.log('first active client. start streaming tweets');
//       stream.start();

//     }
//     openSockets++;
//     //SEND OLD BUFFER TO NEW CLIENT ??? DO I WANT THIS
//     if(oldTweetsBuffer !== null && oldTweetsBuffer.length !== 0){
//       socket.emit(SOCKETIO_TWEETS_EVENT, oldTweetsBuffer);
//     }
//   }
// };

// io.sockets.on('connection', function(socket){
//   socket.on(SOCKETIO_START_EVENT, function(data){
//     handleClient(data, socket);
//   });
  
//   socket.on(SOCKETIO_STOP_EVENT, discardClient);

//   socket.on('disconnect', discardClient);
// });

// //TWITTER EVENT LOGIC
// stream.on('connect', function(request){
//   console.log('connected to twitter stream');

//   //PROBABLY DONT NEED THIS LOGIC
//   if(isFirstTwitterConnection){
//     isFirstTwitterConnection = false;
//     stream.stop();
//   }
// });

// stream.on('disconnect', function(message){
//   console.log('disconnected from twitter stream. ' + message);
// });

// stream.on('reconnect', function(request, response, connectInterval){
//   console.log('trying to reconnect to twitter stream in ' + connectInterval);
// });

// stream.on('tweet', function (tweet) {
//   console.log(tweet);
  
//   var msg = {};
  
//   msg.text = tweet.text;
//   msg.location = tweet.place.full_name;
//   msg.user = {
//     name: tweet.user.name,
//     image: tweet.user.profile_image_url
//   };

//   tweetsBuffer.push(msg);

//   broadcastTweets();
// });

// var broadcastTweets = function(){
//   //NOT SURE IF NEED BUFFER
//   if(tweetsBuffer.length >= TWEETS_BUFFER_SIZE){
//     io.sockets.emit(SOCKETIO_TWEETS_EVENT, tweetsBuffer);

//     oldTweetsBuffer = tweetsBuffer;
//     tweetsBuffer = [];
//   }
// };
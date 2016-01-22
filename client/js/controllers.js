//TWITTER & SCORING LOGIC
app.controller('TweetController', ['$scope', '$interval', 'socket', function($scope, $interval, socket) {

  $scope.count = 0;
  
  $scope.posTweets = 0;
  $scope.negTweets = 0;
  $scope.neutTweets = 0;
  
  $scope.tweets = [];
  $scope.graphData = [{time:Date.now(), score:0}];
  $scope.mapData = [{place:"ca", score:3},{place:"ca", score:3}];
  
  //make graph data array of objects on back end with timestamp?
  // $scope.graphData = [
  //     {time: 1:00pm ,score: 54},
  //   ];
  // }]);

  // $interval(function() {
  //   var hour = $scope.graphData.length + 1;
  //   var sales = Math.round(Math.random() * 100);

  //   $scope.graphData.push({hour: hour, sales: sales});
  // }, 1000, 10);


  $scope.getTweets = function(keyword){

    var tweets = $scope.tweets;
    var graphData = $scope.graphData;
    var mapData = $scope.mapData;

    
    var posTweets = $scope.posTweets;

    // console.log(posTweetsL);
    var negTweets = $scope.negTweets;

    var neutTweets = $scope.neutTweets;


    socket.emit('keyword', keyword);

    socket.on('tweet', function(tweet) {
      
      function GraphDatum(time, score){
        this.time = time;
        this.score = score;
      }

      function MapDatum(place, score){
        this.place = place;
        this.score = score;
      }
      
      tweets.push(tweet);

      graphData.push(new GraphDatum(tweet.time, tweet.score));
      
      //tweet place is an array of words. tweeter's location
      mapData.push(new MapDatum(tweet.place, tweet.score));

      // console.log(graphData);
      if (tweet && !tweet.limit) {
        $scope.count++;
      }
      if(tweet.score < 0){
        posTweets++;
        // posTweets.push(tweet.score);
      }
      else if(tweet.score > 0){
        negTweets++;
        // negTweets.push(tweet.score);
      }
      else{
        neutTweets++;
        // neutTweets.push(tweet.score);
      }
      // if(tweet.score === 0){
      //   $scope.neut.push(tweet)
      // }
      // else if ((tweet.text.indexOf('love') != -1) && (tweet.text.indexOf('hate') != -1)) {
      //     $scope.countMiddle++;
      //     tweet.score++;
      // }
      // else if (tweet.text.indexOf('love') != -1) {
      //     $scope.countLove++;
      //     tweet.score++;
      //     tweet.color = '#57BB7E';
      // }
      // else {
      //     $scope.countHate++;
      //     tweet.score--;
      //     tweet.color = '#FF9B6D';
      // }
      $scope.vm.keyword = '';
    });
  };

  //NEED TO FIX STREAM/SOCKET STOP LOGIC
  $scope.stopStream = function(){
    socket.disconnect();
    socket.emit('disconnect');
  };

  //TIMER
  

  // $scope.startTimer = function() {
  //   if (!interval) {
  //     offset   = Date.now();
  //     interval = setInterval(update);
  //   }
  // };

  // $scope.stopTimer = function() {
  //   if (interval) {
  //     clearInterval(interval);
  //     interval = null;
  //   }
  // };

  // function update() {
  //   clock += delta();  
  // }

  // function delta() {
  //   var now = Date.now(),
  //       d   = now - offset;
    
  //   offset = now;
  //   return d;
  // }
  
  

}]);

//SINGLE PAGE CONTROLS 
app.controller("tabController", function($scope){
  $scope.tab = 1;

  $scope.setTab = function(newTab){
    $scope.tab = newTab;
  };

  $scope.isSet = function(tabNum){
    return $scope.tab === tabNum;
  };
});


//AUTHENTICATION LOGIC
app.controller("LoginController", function($scope, $auth, $location){
  $scope.authenticate = function(provider) {
    console.log('THIS IS PROVIDER', provider);
    $auth.authenticate(provider)
      .then(function(data) {
        console.log('THIS IS', data);
        console.log('You have successfully signed in with ' + provider + '!');
        console.log('THIS IS AUTH', $auth);
        $location.path('/home');
      })
      .catch(function(error) {
        if (error.error) {
          // Popup error - invalid redirect_uri, pressed cancel button, etc.
          console.log(error.error);
        } else if (error.data) {
          // HTTP response error from server
          console.log(error.data.message, error.status);
        } else {
          console.log(error);
        }
      });
  };
});


app.controller('LogoutController', function($location, $auth) {
    if (!$auth.isAuthenticated()) { return; }
    $auth.logout()
      .then(function() {
        console.log('You have been logged out');
        $location.path('/');
      });
  });


app.controller('SignupController', function($scope, $location, $auth) {
    $scope.signup = function() {
      $auth.signup($scope.user)
        .then(function(response) {
          $auth.setToken(response);
          $location.path('/');
          console.log('You have successfully created a new account and have been signed-in');
        })
        .catch(function(response) {
          console.log(response.data.message);
        });
    };
  });
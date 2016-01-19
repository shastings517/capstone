//TWITTER & SCORING LOGIC
app.controller('TweetController', ['$scope', 'socket', function($scope, socket) {

  $scope.count = 0;
  // $scope.countLove = 0;
  // $scope.countHate = 0;
  // $scope.countMiddle = 0;
  
  $scope.tweets = [];

  
  $scope.getTweets = function(keyword){
    var tweets = $scope.tweets;
    socket.emit('keyword', keyword);

    socket.on('tweet', function(tweet) {
      // tweet.score = 0;
      tweets.push(tweet);
      if (tweet && !tweet.limit) {
        $scope.count++;
      }
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
// app.controller("TweetController", ['$scope', 'socket', 
//   function TweetController ($scope, socket){

//     $scope.tweets = [];
//     // $scope.btnStop = false;

//     $scope.findTweets = function(){
//       socket.emit('tweet-io:start', true);
//       // $scope.btnStop = true;

//       debugger 
//       socket.on('tweet-io:tweets', function (data){
//       console.log(data);
//         $scope.tweets = $scope.tweets.concat(data);
//       }); 
//     };
//   }
// ]);

app.controller('AppCtrl', ['$scope', 'socket', function($scope, socket) {

    $scope.tabs = [];
    // console.log(q);
    $scope.selectedIndex = 0;
    $scope.onTabSelected = onTabSelected;

    $scope.addTab = function(title, q) {
      var tabs = $scope.tabs;
      var style = 'tab' + (tabs.length % 4 + 1);
      var tab = {
        title: title,
        active: true,
        style: style,
        q: q
      };
      if (!dupes(tab)) {
        tabs.push(tab);
        $scope.tContent = '';
        // $scope.tTitle = '';
        spawnSearch(q, tab);
        // console.log(q);
      } else {
        alert('A search with this query already exists');
      }
    };

    $scope.removeTab = function(tab) {
      //https://github.com/angular/material/issues/573
      var tabs = $scope.tabs;
      for (var j = 0; j < tabs.length; j++) {
        if (tab.title == tabs[j].title) {
          tabs.splice(j, 1);
          $scope.selectedIndex = (j == 0 ? 1 : j - 1);
          socket.emit('remove', tab.q);
          break;
        }
      }
    };

    $scope.submit = function($event) {
      if ($event.which !== 13) return;
      // if ($scope.tTitle) {
        $scope.addTab($scope.tContent);
        // $scope.addTab($scope.tTitle, $scope.tContent);
      // }
    };


    // **********************************************************
    // Private Methods
    // **********************************************************

    function onTabSelected(tab) {
      $scope.selectedIndex = this.$index;
      updateScope(tab);

    }

    function updateScope(tab) {
      if ($scope.tabs[$scope.selectedIndex] && $scope.tabs[$scope.selectedIndex].q == tab.q) {
        $scope.tweets = $scope['tweets_' + tab.q];
        console.log($scope.tweets);
      }
    }

    function spawnSearch(q, tab) {
      socket.emit('q', q);
      $scope['tweets_' + q] = [];
      socket.on('tweet_' + q, function(tweet) {
        console.log(q, tweet);
        if ($scope['tweets_' + q].length == 10) {
          $scope['tweets_' + q].shift();
        }
        $scope['tweets_' + q] = $scope['tweets_' + q].concat(tweet);

        updateScope(tab);
      });
    }

    function dupes(tab) {
      var tabs = $scope.tabs;
      for (var j = 0; j < tabs.length; j++) {
        if (tab.q == tabs[j].q) {
          return true;
        }
      }
      return false;
    }

    //$scope.addTab('interstellar', 'interstellar');
    //$scope.addTab('lucy', 'lucy');

  }]);

}]);

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
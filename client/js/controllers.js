app.controller("MainController", function($scope){

  // app.controller('TestApp', function($scope) {
      $scope.count = 1;
      $scope.countLove = 0;
      $scope.countHate = 0;
      $scope.countMiddle = 0;
      $scope.countPass = 0;
      $scope.twitts = [
          {user: {screen_name: 'Test'}, text: 'Text twitt'}
      ];
      $scope.start = function(){


      var socket = io.connect();
      window.socket = socket;
      socket.on('newTwitt', function (item) {
          $scope.twitts.push(item);
          if (item && !item.limit) {
              $scope.count++;
          }
          if (item.limit) {
              $scope.countPass += item.limit.track;
          }
          else if ((item.text.indexOf('amor') != -1 || item.text.indexOf('love') != -1) &&
              (item.text.indexOf('odio') != -1 || item.text.indexOf('hate') != -1)) {
              $scope.countMiddle++;
          }
          else if (item.text.indexOf('amor') != -1 || item.text.indexOf('love') != -1) {
              $scope.countLove++;
              item.color = 'green';
          }
          else {
              $scope.countHate++;
              item.color = 'red';
          }
          console.log(JSON.stringify(item));
          if ($scope.twitts.length > 15)
              $scope.twitts.splice(0, 1);
          $scope.$apply();

      });
  };
      $scope.stop = function(){
          socket.disconnect();
      };

});

app.controller("LoginController", function($scope, $auth, $location){
  $scope.authenticate = function(provider) {
    $auth.authenticate(provider)
      .then(function() {
        console.log('You have successfully signed in with ' + provider + '!');
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
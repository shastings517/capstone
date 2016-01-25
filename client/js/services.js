app.factory('socket', function(socketFactory) {
  return socketFactory({
    ioSocket: io.connect('https://tweeter-app-capstone.herokuapp.com'||'http://localhost:3000')
  });
});



//GET USER INFO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// $scope.user = $auth.getPayload().user;

app.factory('socket', function(socketFactory) {
  return socketFactory({
    ioSocket: io.connect('http://localhost:3000' || 'https://tweeter-app-capstone.herokuapp.com')
  });
});



//GET USER INFO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// $scope.user = $auth.getPayload().user;

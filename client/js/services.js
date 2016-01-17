app.factory('socket', function(socketFactory) {
  return socketFactory({
    ioSocket: io.connect('http://localhost:3000')
  });
});

//GET USER INFO
// $scope.user = $auth.getPayload().user;

app.factory('socket', function ($rootScope){
  var socket = io.connect('http://localhost:3000');
  return {
    on: function (eventName, callback){
      socket.on (eventName, function(){
        var args = arguments;
        $rootScope.$apply(function(){
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback){
      socket.emit (eventName, data, function(){
        var args = arguments;
        $rootScope.$apply(function(){
          if(callback){
            callback.apply(socket, args);
          }
        });
      });
    }
  };
});
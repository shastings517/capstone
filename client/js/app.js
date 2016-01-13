var app = angular.module("satapp", ['ngRoute','satellizer']);

app.config(function($routeProvider, $locationProvider, $authProvider){
  $routeProvider
  .when('/home', {
    controller: "MainController",
    templateUrl: "templates/index.html",
    resolve: {
      loginRequired: loginRequired
    }
  })
  .when('/', {
    controller: "LoginController",
    templateUrl: "templates/login.html",
    resolve: {
      skipIfLoggedIn: skipIfLoggedIn
    }
  })
  .when('/signup', {
    controller: "SignupController",
    templateUrl: "templates/login.html",
    resolve: {
      skipIfLoggedIn: skipIfLoggedIn
    }
  })
  .when('/logout', {
    template: null,
    controller: 'LogoutController'
  })
  .otherwise({redirectTo:'/'});

  $locationProvider.html5Mode(true);

  // $authProvider.facebook({
  //   clientId: '297860257039585',
  //   url: '/api/auth/facebook'
  // });
  $authProvider.twitter({
    url: '/api/auth/twitter'
  });
  // $authProvider.twitter({
  //   url: '/auth/twitter',
  //   authorizationEndpoint: 'https://api.twitter.com/oauth/authenticate',
  //   redirectUri: window.location.origin,
  //   type: '1.0',
  //   popupOptions: { width: 495, height: 645 }
  // });



  function skipIfLoggedIn($q, $auth, $location) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        $location.path('/home');
        deferred.reject();
      } else {
        deferred.resolve();
      }
      return deferred.promise;
    }

    function loginRequired($q, $location, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.resolve();
      } else {
        $location.path('/');
      }
      return deferred.promise;
    }
});

//TWITTER & SCORING LOGIC
app.controller('TweetController', ['$scope', 'socket', function($scope, socket) {

  $scope.count = 0;
  
  // $scope.n3 = [];
  // $scope.n2 = [];
  // $scope.n1 = [];
  // $scope.neut = [];
  // $scope.p3 = [];
  // $scope.p2 = [];
  // $scope.p1 = [];
  
  $scope.posTweets = 0;
  $scope.negTweets = 0;
  $scope.neutTweets = 0;
  
  $scope.tweets = [];
  //make graph data array of objects on back end with timestamp?
  // $scope.graphData = [
  //     {time: 1:00pm ,score: 54},
  //   ];
  // }]);



  $scope.getTweets = function(keyword){
    
    var tweets = $scope.tweets;
    var posTweets = $scope.posTweets;

    // console.log(posTweetsL);
    var negTweets = $scope.negTweets;

    var neutTweets = $scope.neutTweets;


    socket.emit('keyword', keyword);

    socket.on('tweet', function(tweet) {
      // tweet.score = 0;
      tweets.push(tweet);
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

//D3
var w = 500;
      var h = 100;
      var barPadding = 1;
      
      var dataset = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
              11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];
      
      //Create SVG element
      var svg = d3.select("div.graphContainer")
            .append("svg")
            .attr("width", w)
            .attr("height", h);
      svg.selectAll("rect")
         .data(dataset)
         .enter()
         .append("rect")
         .attr("x", function(d, i) {
            return i * (w / dataset.length);
         })
         .attr("y", function(d) {
            return h - (d * 4);
         })
         .attr("width", w / dataset.length - barPadding)
         .attr("height", function(d) {
            return d * 4;
         })
         .attr("fill", function(d) {
          return "rgb(0, 0, " + (d * 10) + ")";
         });
      svg.selectAll("text")
         .data(dataset)
         .enter()
         .append("text")
         .text(function(d) {
            return d;
         })
         .attr("text-anchor", "middle")
         .attr("x", function(d, i) {
            return i * (w / dataset.length) + (w / dataset.length - barPadding) / 2;
         })
         .attr("y", function(d) {
            return h - (d * 4) + 14;
         })
         .attr("font-family", "sans-serif")
         .attr("font-size", "11px")
         .attr("fill", "white");


// var n = 40,
//     random = d3.random.normal(0, 0.2),
//     data = d3.range(n).map(random);
// var margin = {top: 20, right: 20, bottom: 20, left: 40},
//     width = 500 - margin.left - margin.right,
//     height = 250 - margin.top - margin.bottom;
// var x = d3.scale.linear()
//     .domain([1, n - 2])
//     .range([0, width]);
// var y = d3.scale.linear()
//     .domain([-1, 1])
//     .range([height, 0]);
// var line = d3.svg.line()
//     .interpolate("basis")
//     .x(function(d, i) { return x(i); })
//     .y(function(d, i) { return y(d); });

// var svg = d3.select(".graphContainer").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
// svg.append("defs").append("clipPath")
//     .attr("id", "clip")
//   .append("rect")
//     .attr("width", width)
//     .attr("height", height);
// svg.append("g")
//     .attr("class", "x axis")
//     .attr("transform", "translate(0," + y(0) + ")")
//     .call(d3.svg.axis().scale(x).orient("bottom"));
// svg.append("g")
//     .attr("class", "y axis")
//     .call(d3.svg.axis().scale(y).orient("left"));
// var path = svg.append("g")
//     .attr("clip-path", "url(#clip)")
//   .append("path")
//     .datum(data)
//     .attr("class", "line")
//     .attr("d", line);
// tick();
// function tick() {
//   // push a new data point onto the back
//   data.push(random());
//   // redraw the line, and slide it to the left
//   path
//       .attr("d", line)
//       .attr("transform", null)
//     .transition()
//       .duration(500)
//       .ease("linear")
//       .attr("transform", "translate(" + x(0) + ",0)")
//       .each("end", tick);
//   // pop the old data point off the front
//   data.shift();
// }



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
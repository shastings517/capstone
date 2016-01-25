app.directive("linearChart", function($parse, $window) {
  return{
    restrict: "EA",
    template: "<svg width='900' height='450'></svg>",
    link: function(scope, elem, attrs){

      var exp = $parse(attrs.chartData);
      var graphData = exp(scope);
      var padding = 20;
      var pathClass = "path";
      var xScale, yScale, xAxisGen, yAxisGen, lineFun;
          
      var d3 = $window.d3;
      var rawSvg = elem.find("svg")[0];
      var svg = d3.select(rawSvg);

      scope.$watchCollection(exp, function(newVal, oldVal) {
        graphData = newVal;
        redrawLineChart();
      });

      function setChartParameters(){
        xScale = d3.scale.linear()
                   .domain([graphData[0].time, graphData[0].time + 50000])
                   .range([padding, rawSvg.clientWidth - padding]);

        yScale = d3.scale.linear()
                   .domain([-15, 15])
                   .range([rawSvg.clientHeight - padding, 10]);

        xAxisGen = d3.svg.axis()
                     .scale(xScale)
                     // .orient("bottom")
                     .tickValues([])
                     .ticks(20);

        yAxisGen = d3.svg.axis()
                     .scale(yScale)
                     .orient("left")
                     .ticks(20);

        lineFun = d3.svg.line()
                    .x(function (d) {
                      return xScale(d.time);
                    })
                    .y(function (d) {
                      return yScale(d.score);
                    })
                    .interpolate("basis");
      }
               
      function drawLineChart() {

        setChartParameters();

        svg.append("svg:g")
           .attr("class", "x axis")
           .attr("transform", "translate(0,217)")
           .call(xAxisGen);

         svg.append("svg:g")
            .attr("class", "y axis")
            .attr("transform", "translate(25,0)")
            .call(yAxisGen);

         svg.append("svg:path")
            .attr({
              d: lineFun(graphData),
              "stroke": "#7DBCA9",
              "stroke-width": 2,
              "fill": "none",
              "class": pathClass
         });
      }

      function redrawLineChart() {

        setChartParameters();
        svg.selectAll("g.y.axis").call(yAxisGen);
        svg.selectAll("g.x.axis").call(xAxisGen);

        svg.selectAll("." + pathClass)
           .attr({
             d: lineFun(graphData)
           });
      }

      drawLineChart();
    }
  };
});

app.directive("mapChart", function($parse, $window) {
  return{
    restrict: "EA",
    template: "<svg></svg>",
    link: function(scope, elem, attrs){

      var w = 900;
      var h = 450;

      var exp = $parse(attrs.mapData);
      mapData = exp(scope);
      // console.log(mapData);
          
      var d3 = $window.d3;
      var rawSvg = elem.find("svg")[0];
      var svg = d3.select(rawSvg)
          .attr("width", w)
          .attr("height", h)
          .style("fill", "white");

      finalArr = [];

      //$WATCH UPDATE FUNCTION
      scope.$watchCollection(exp, function(newVal, oldVal) {

        mapData = newVal;
        states = states || "";

        // go through all the states
        // go through all of the tweets (mapData)

        // return the state objects with the tweet scores
        // where it matches

        // return an array where the state
        if(states){
          finalArr = [];
          // state.score = 0;
          // console.log();
          states.features.forEach(function(state){
            return mapData.forEach(function(el){
              if(el.place){
                if(el.place.indexOf(state.properties.NAME10.toLowerCase()) !== -1 || el.place.indexOf(state.properties.STUSPS10.toLowerCase()) !== -1){
                  if((finalArr.indexOf(state)) !== -1){
                    // debugger
                    state.score += el.score;
                    // el.score < 0 ? state.score += el.score : state.score += el.score;
                    console.log("STATE",state.score, state.info);
                    console.log("EL", el.score);
                  
                  } 
                  else {
                    state.score = el.score;
                    state.info = el.place;
                    finalArr.push(state);
                  }
                  
                }
              }
            });
          });
          // console.log("FINAL", finalArr)
          // console.log(el.score)
        }
        // svg.selectAll("path")
        //         .style("fill","white");

        svg.selectAll("path")
                .data(finalArr, function(d){
                  return d.id;
                })
                // .enter()
                
                // .style("fill", "white")
                .style("fill-opacity", function(d){
                  if(d.score <= -20){
                    return 1;
                  }
                  if(d.score <= -15 && d.score > -20){
                    return 0.8;
                  }
                  if(d.score <= -10 && d.score > -15){
                    return 0.6;
                  }
                  if(d.score <= -5 && d.score > -10){
                    return 0.4;
                  }
                  if(d.score < 0 && d.score > -5){
                    return 0.2;
                  }
                  if(d.score <= 5 && d.score > 0){
                    return 0.2;
                  }
                  if(d.score <= 10 && d.score > 5){
                    return 0.6;
                  }
                  if(d.score <= 15 && d.score > 10){
                    return 0.8;
                  }
                  if(d.score <= 20 && d.score > 15){
                    return 1;
                  }
                  


                  
                }).style("fill", function(d){
                  if(d.score < 0){
                    return "FF5107";
                  }
                  if(d.score > 0){
                    return "0BBA4E";
                  }
                  if(d.score === 0){
                    return "EAFD89";
                  }
                });
                // .transition()
                // // .duration(25)
                // .style("fill", function(d,i){
                //   if(d.score <= -8){
                //     return "FF9B6D";
                //   }
                //   if(d.score <= -5 && d.score > -8){
                //     return "FFD37C";
                //   }
                //   if(d.score <= 0 && d.score > -5){
                //     return "EAFD89";
                //   }
                //   if(d.score <= 5 && d.score > 0){
                //     return "7DBCA9";
                //   }
                //   if(d.score < 13){
                //     return "57BB7E";
                //   }
                // });
      });     

      d3.json("/js/state-names.json", function(error, us) {

        if (error) return console.error(error);
        
        states = topojson.feature(us, us.objects.state);
        
        var projection = d3.geo.albersUsa()
                           .scale(880)
                           .translate([w / 2, h / 2]);
        
        var path = d3.geo.path()
                     .projection(projection);

        //draw full map
        svg.append("path")
              .datum(states)
              .attr("d", path);
              
        //assign every state an id and color
        svg.selectAll("state")
              .data(topojson.feature(us, us.objects.state).features)
              .enter().append("path")
              .attr("class", function(d) { 
                // console.log('features', d);
                return "state";  })
              .attr("d", path)
              .style("fill", "#999999");
              
        //draw inner state borders
        svg.append("path")
            .datum(topojson.mesh(us, us.objects.state, function(a, b) { return a !== b; }))
            .attr("d", path)
            .attr("class", "state-boundary");

        //draw outer border
        svg.append("path")
            .datum(topojson.mesh(us, us.objects.state, function(a, b) { return a === b; }))
            .attr("d", path)
            .attr("class", "us-boundary");
            
      });
    }
  };
});

// HELP MODAL
app.directive('modal', function () {
  return {
    templateUrl: "templates/help.html",
    restrict: 'E',
    transclude: true,
    replace:true,
    scope:true,
    link: function postLink(scope, element, attrs) {
      scope.title = attrs.title;

      scope.$watch(attrs.visible, function(value){
        if(value === true)
          $(element).modal('show');
        else
          $(element).modal('hide');
      });

      $(element).on('shown.bs.modal', function(){
        scope.$apply(function(){
          scope.$parent[attrs.visible] = true;
        });
      });

      $(element).on('hidden.bs.modal', function(){
        scope.$apply(function(){
          scope.$parent[attrs.visible] = false;
        });
      });
    }
  };
});

//ABOUT MODAL
// app.directive('aboutmodal', function () {
//   return {
//     templateUrl: "templates/about.html",
//     restrict: 'E',
//     transclude: true,
//     replace:true,
//     scope:true,
//     link: function postLink(scope, element, attrs) {
//       scope.title = attrs.title;

//       scope.$watch(attrs.visible, function(value){
//         if(value === true)
//           $(element).aboutmodal('show');
//         else
//           $(element).aboutmodal('hide');
//       });

//       $(element).on('shown.bs.aboutmodal', function(){
//         scope.$apply(function(){
//           scope.$parent[attrs.visible] = true;
//         });
//       });

//       $(element).on('hidden.bs.aboutmodal', function(){
//         scope.$apply(function(){
//           scope.$parent[attrs.visible] = false;
//         });
//       });
//     }
//   };
// });

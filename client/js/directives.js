app.directive("linearChart", function($parse, $window) {
  return{
    restrict: "EA",
    template: "<svg width='850' height='400'></svg>",
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
                   .domain([-10, 10])
                   .range([rawSvg.clientHeight - padding, 0]);

        xAxisGen = d3.svg.axis()
                     .scale(xScale)
                     // .orient("bottom")
                     .ticks(50);

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
           .attr("transform", "translate(0,180)")
           .call(xAxisGen);

         svg.append("svg:g")
            .attr("class", "y axis")
            .attr("transform", "translate(20,0)")
            .call(yAxisGen);

         svg.append("svg:path")
            .attr({
              d: lineFun(graphData),
              "stroke": "blue",
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

      var w = 850;
      var h = 400;

      var exp = $parse(attrs.mapData);
      var mapData = exp(scope);
      // var xScale, yScale, xAxisGen, yAxisGen, lineFun;
          
      var d3 = $window.d3;
      var rawSvg = elem.find("svg")[0];

      // var projection = d3.geo.albersUsa()
      //     .scale(1000)
      //     .translate([w / 2, h / 2]);

      // var path = d3.geo.path()
      //     .projection(projection);

      var svg = d3.select(rawSvg)
      // var svg = d3.select("body").append("svg")
          .attr("width", w)
          .attr("height", h);

      d3.json("/js/state-names.json", function(error, us) {
        if (error) return console.error(error);
        console.log(us);
        
        var states = topojson.feature(us, us.objects.state);
        
        var projection = d3.geo.albersUsa()
                           .scale(950)
                           .translate([w / 2, h / 2]);
        
        var path = d3.geo.path()
                     .projection(projection);

        svg.append("path")
              .datum(states)
              .attr("d", path);
      });

      // d3.json("/js/us-states-simplified.json", function(error, us) {
      //   if (error) throw error;

      //   var state = us.objects.states.geometries[0];
        
      //   svg.insert("path", ".graticule")
      //       .datum(topojson.feature(us, us.objects.land))
      //       .attr("class", "land")
      //       .attr("d", path)
      //       .style("fill", function(d,i){

      //       });
      //       // console.log(us.objects.states)


            

      //   // svg.insert("path", ".graticule")
      //   //     .datum(topojson.mesh(us, us.objects.counties, function(a, b) { return a !== b && !(a.id / 1000 ^ b.id / 1000); }))
      //   //     .attr("class", "county-boundary")
      //   //     .attr("d", path);

      //   svg.insert("path", ".graticule")
      //       .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      //       .attr("class", "state-boundary")
      //       .attr("d", path);

        // svg.select("land", function(d,i){

        // })
            // .style("fill", "red");
              // var alabama = us.objects.states.geometries[0];

            // });

            // console.log(us.objects.states.geometries[0].id)


      // });

      // d3.select(self.frameElement).style("height", h + "px");
      
    }
  };
});
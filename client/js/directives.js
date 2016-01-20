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
                   .domain([graphData[0].time, graphData[graphData.length-1].time + 100000])
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
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
      mapData = exp(scope);
      // console.log(mapData);
          
      var d3 = $window.d3;
      var rawSvg = elem.find("svg")[0];
      var svg = d3.select(rawSvg)
          .attr("width", w)
          .attr("height", h);


      scope.$watchCollection(exp, function(newVal, oldVal) {
        // states.features
        states = states || "";
        console.log(mapData);
        mapData = newVal;
        if(states){
          places = states.features.filter(function(state){
            return mapData.filter(function(el){ 
             if(el.place){
              return el.place.indexOf(state.properties.NAME10.toLowerCase()) !== -1 || el.place.indexOf(state.properties.STUSPS10.toLowerCase()) !== -1;
             }
          });
        

          // if(el.place) {
          //   return el.place.indexOf(states.properties.NAME10.toLowerCase()) !== -1 || el.place.indexOf(d.properties.STUSPS10.toLowerCase()) !== -1;
          // }
          // return _.contains(el.place, d.properties.STUSPS10.toLowerCase()) || _.contains(el.place,d.properties.NAME10.toLowerCase());
          // return "red";
        });
      }
        // redrawLineChart();
      });

      d3.json("/js/state-names.json", function(error, us) {

        if (error) return console.error(error);
        // console.log("first", us.objects.state.geometries[1].properties);
        
        states = topojson.feature(us, us.objects.state);
        
        var stateObjArr = us.objects.state.geometries;
        var stateNameArr = [];

        stateObjArr.forEach(function(el){
          stateNameArr.push(el.properties);
        });

        // for(var i=0; i<d3.values(us.objects.state.geometries[1].properties);
        
        // console.log("STATE", stateNameArr);
        var projection = d3.geo.albersUsa()
                           .scale(950)
                           .translate([w / 2, h / 2]);
        
        var path = d3.geo.path()
                     .projection(projection);

        // function stateCheck(){

        // }

        //draw full map
        svg.append("path")
              .datum(states)
              .attr("d", path);
              

        //assign every state an id and color
        svg.selectAll("state")
              .data(topojson.feature(us, us.objects.state).features)
              .enter().append("path")
              .attr("class", function(d) { 
                console.log('features', d);
                return "state" + d.id;  })
              .attr("d", path)
              .style("fill", function(d){
                console.log(d.properties.STUSPS10, d.properties.NAME10);
                console.log(mapData);
                
                // debugger
              });


         // function isBiggerThan10(element, index, array) {
         //   return element > 10;
         // }
         // [2, 5, 8, 1, 4].some(isBiggerThan10);  // false
         // [12, 5, 8, 1, 4].some(isBiggerThan10); // true
              
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

            console.log("THIS", us.objects.state.geometries[1].properties);

          // var mapData = [{place:null, score:0}];
          // var stateNameArray = [{NAME10: "Wyoming", STUSPS10: "WY"}]


        // svg.selectAll("state")
        //       .data(topojson.feature(us, us.objects.state).features)
        //       .style("fill", function(d, i){
        //         console.log(d);
        //         // d.properties
        //       });


              // var scoreObjs = {love: 1, hate: -1};

              // var tweet = "love love love love hate hate";

              // tweet.split(" ").reduce(function(prev, cur) {

              //   return prev + (scoreObjs[cur] ? scoreObjs[cur] : 0);

              // },0);

              
              // d.filter(function(el){
              //   el.NAME10 === mapData.place ? 
              // })

              // .attr("class", function(d) { return "state" + d.id; })
              // .attr("d", path)
              // .style("fill", "white");
        //import sentiment date and style state color wrap in function    
        // svg.append("path")
        //     // debugger
        //     .datum(topojson.feature(us, us.objects.state))
        //     .attr("d", path)
        //     .attr("class", "place");

        // if(mapData === )

        //FUNCTION FOR COLORING MAP GOES HERE
        // function setMapParameters() {
        //   lineFun = d3.svg.line()
        //               .x(function (d) {
        //                 return xScale(d.time);
        //               })
        //               .y(function (d) {
        //                 return yScale(d.score);
        //               })
        //               .interpolate("basis");
          
        // }

        // //FUNCTION TO DRAW MAP
        // function drawLineChart() {

        //   setChartParameters();

        //    svg.append("svg:path")
        //       .attr({
        //         d: lineFun(graphData),
        //         "stroke": "blue",
        //         "stroke-width": 2,
        //         "fill": "none",
        //         "class": pathClass
        //    });
        // }


        // //FUNCTION TO REDRAW MAP
        // function redrawLineChart() {

        //   setChartParameters();
        //   svg.selectAll("g.y.axis").call(yAxisGen);
        //   svg.selectAll("g.x.axis").call(xAxisGen);

        //   svg.selectAll("." + pathClass)
        //      .attr({
        //        d: lineFun(graphData)
        //      });
        // }


        

      });
    
  }
};
});
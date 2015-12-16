
function createBarPlot(barPlotData){
  var variable = barPlotData['type'];
  var listOfBarData = barPlotData['data'];
  
  var margin = {top: 20, right: 60, bottom: 30, left: 60},
      width = 800 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
       //  _________
       // |   ___   | 
       // |  |   |  |
       // |.5|   |  |
      .rangeRoundBands([0, width], .5)
      .domain(listOfBarData.map(function(d) { return d[variable]; }));

  var y = d3.scale.linear()
      .range([height, 0])
      .domain([0, d3.max(listOfBarData, function(d) { 
        return d['Freq']; 
      })]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(10);

  //Set up svg cont.
  var svg = d3.select(".chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        //Text styling for the y axis
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Frequency");

    svg.selectAll(".bar")
        .data(listOfBarData)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d[variable]); })
        //rangeBand returns bar width including 
        .attr("width", x.rangeBand())
        .attr("y", function(d) { 
          return 500; 
        })
        .attr("height", function(d) { return 0 })
        .transition()
          .delay(function(d, i) { return i * 200; })
          .duration(400)
          .attr('y', function(d) { 
            return y(d['Freq']) 
          })
          .attr("height", function(d) { 
            return height - y(d['Freq']); 
          })
}
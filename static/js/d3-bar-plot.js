
function createBarPlot(barPlotData){
  $('.svg-bar-container svg').remove();
  var variable = 'doctor_type';
  var listOfBarData = barPlotData['bar_plot'];
  
  var margin = {top: 50, right: 60, bottom: 300, left: 60};
  var width = 800 - margin.left - margin.right;
  var height = 700 - margin.top - margin.bottom;

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
        return d['frequency']; 
      })]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(10);

  //Set up svg cont.
  var svg = d3.select(".svg-bar-container").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr('class', 'bar-chart')
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        //Rotate x-axis labels
        .selectAll("text")  
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-50)" );

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
        .attr("y", function(d) { return 500; })
        .attr("height", function(d) { return 0 })
        .transition()
          .delay(function(d, i) { return i * 200; })
          .duration(400)
          .attr('y', function(d) { return y(d['frequency']) })
          .attr("height", function(d) { return height - y(d['frequency']);})
}
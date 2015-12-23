function createMap(data_slice) {
  $('.svg-map-container svg').remove()
  var data =  data_slice['doctor_per_pop']
  var data_values = data_slice['population_data']

  var width = 960;
  var height = 600;
  var rateById = d3.map(data)

  //Returns a class based on value and where if falls between the 10 intervals between 0// .15
  var quantize = d3.scale.quantile()
    .domain(data_values)
    .range(d3.range(6).map(function(i) { return "setq" + i + "-9"; }));

  var projection = d3.geo.albersUsa()
    .scale(1100)
    .translate([width / 2, height / 2]);

  var map_path = d3.geo.path()
    .projection(projection);
  
  var map_svg = d3.select(".svg-map-container").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr('class', 'map')

  queue()
    .defer(d3.json, "/static/us-topo.json")
    .await(ready);
    function ready(error, us) {
      if (error) throw error;
      
      map_svg.append("g")
          .attr("class", 'counties')
        .selectAll("path")
          .data(topojson.feature(us, us.objects.counties).features)
        .enter().append("path")
          .attr("class", function(d) { return quantize(rateById.get(d.id)) || 'setq0-9';})
          .attr("d", map_path);
      
       map_svg.append("path")
        .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
        .attr("class", "states")
        .attr("d", map_path);
    }
}

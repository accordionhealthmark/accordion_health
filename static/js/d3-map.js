function createMap(data_slice) {
  var mapType = data_slice['map_type']
  var data =  data_slice['M'] || data_slice['1'] || data_slice['Y'];
  
  var width = 960,
  height = 600;

  var rateById = d3.map(data)
  //Returns a class based on value and where if falls between the 10 intervals between 0// .15
  var quantize = d3.scale.quantize()
    .domain([0, 1])
    .range(d3.range(9).map(function(i) { return "setq" + i + "-9"; }));

  var projection = d3.geo.albersUsa()
    .scale(1000)
    .translate([width / 2, height / 2]);

  var map_path = d3.geo.path()
    .projection(projection);
  
  var map_svg = d3.select(".map").append("svg")
    .attr("width", width)
    .attr("height", height);

  queue()
    .defer(d3.json, "/static/us-topo.json")
    .await(ready);
    function ready(error, us) {
      if (error) throw error;
      var mapData = mapType === 'State' ? us.objects.states : us.objects.counties
      var gClass = mapType === 'State' ? 'states' : 'counties'
      var strokeColor = mapType === 'State' ? '#333': '#fff'

      map_svg.append("g")
          .attr("class", gClass)
        .selectAll("path")
          .data(topojson.feature(us, mapData).features)
        .enter().append("path")
          .attr("class", function(d) { return quantize(rateById.get(d.id));})
          .attr("d", map_path);

      if (mapType === 'County') { 
        map_svg.append("path")
          .data(topojson.feature(us, us.objects.states).features)
          // .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
          .attr("class", "states")
          .attr("d", map_path)
        }
      }
}

var w = window.innerWidth;
var h = window.innerHeight;

var svg = d3
  .select("#line")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

var line = d3
  .line()
  .x(function(d, i) {
    return x(i);
  })
  .y(function(d, i) {
    return y(d);
  })
  .defined(function(d) {
    return d != 0;
  })
  .curve(d3.curveNatural);

var x = d3
  .scaleLinear()
  .domain([0, 10])
  .range([0, w]);

var y = d3
  .scaleLinear()
  .domain([0, 200])
  .range([h, 0]);

var div = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

var datatitle = svg
  .append("text")
  .attr("dx", x(8))
  .attr("dy", y(50))
  .text("SLDFKJDKLSFJ")
  .attr("class", "datatitle")
  .style("opacity", 0);

var year = svg.append("text")
  .attr("dx", x(3))
  .attr("dy", y(50))
  .attr("id", "year")
  .text("1900")
  .attr("fill", "black");

var xAxis = d3.axisTop(x);
var yAxis = d3.axisLeft(y);

svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + h + ")")
  .call(xAxis);

// Add the Y Axis
svg.append("g")
  .attr("class", "y axis")
  .call(yAxis);

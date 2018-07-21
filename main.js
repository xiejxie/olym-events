let drawCircles = (data) => {
  svg
  .selectAll("dot")
  .data(data)
  .enter()
  .append("circle")
      .attr("r", 5)
      .attr("opacity", 0)
      .attr("cx", function(d, i) { return x(i); })
      .attr("cy", function(d, i) { return y(d); })
      .on("mouseover", function(d) {
          div.transition()
              .duration(200)
              .style("opacity", .9);
          div	.html("Hello" + "<br/>"  + "Bye")
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 28) + "px");
          })
      .on("mouseout", function(d) {
          div.transition()
              .duration(500)
              .style("opacity", 0);
      })
      .transition()
        .duration(3000)
        .ease(d3.easeExpIn)
        .attr("opacity", 1);
    }

let repeat = (svg, year, sportdata) => {
  // Uncomment following line to clear the previously drawn line
  let years = ["1970", "1980"];
  let delay = 1000;

  // Set a light grey class on old paths
  // svg.selectAll("path").attr("class", "old");

  var group1 = svg.
    append("g")

  var path = group1
    .append("path")
      .attr("d", line(sportdata))
      .attr("stroke", "darkgrey")
      .attr("stroke-width", "2")
      .attr("fill", "none");

  var hitPath = group1
    .append("path")
      .attr("d", line(sportdata))
      .attr("stroke-width", "20")
      .attr("stroke", "blue")
      .attr("fill", "none")
      .attr("opacity", 0.5)
      .on("mouseover", () => {
          datatitle
              .transition()
              .duration(200)
              .style("opacity", 1);
          })
      .on("mouseout", () => {
          datatitle
              .style("opacity", 0);
      });

  var totalLength = path.node().getTotalLength();

  path
    .attr("stroke-dasharray", totalLength + " " + totalLength)
    .attr("stroke-dashoffset", totalLength)
    .transition()
      .duration(2000)
      .ease(d3.easeLinear)
      .tween("text", (t) => {
        return (t) => {
          let arr = ["1975", "1980", "1985"]
          let ind = (Math.round((arr.length-1)*t))
          year.text(arr[ind])
        }
      })
      .attr("stroke-dashoffset", 0)
      .on("end", drawCircles(sportdata));
    };

d3.json("fakedata.json", function(json) {
  for (sport in json.data) {
    repeat(svg, year, json.data[sport]);
  }
})

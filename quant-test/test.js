// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 10, left: 10},
  width = 480 - margin.left - margin.right,
  height = 270 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select(".dataviz")
.append("svg")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("preserveAspectRatio", "xMidYMid meet")
    // .attr("width", width)
    // .attr("height", height)
.append("g")

// read json data
d3.json('data/test.json').then(function(data) {

  // Give the data to this cluster layout:
  const root = d3.hierarchy(data)
    .sum(function(d){ return d.value}) // Here the size of each leave is given in the 'value' field in input data
    .sort((a, b) => b.value - a.value); //sort from high to low counts
  console.log(root);

  // Then d3.treemap computes the position of each element of the hierarchy
  d3.treemap()
    // .tile(tile)
    .size([width, height])
    .padding(2)
    (root)

  // use this information to add rectangles:
  const leaf = svg
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
      .attr('x', function (d) { return d.x0; })
      .attr('y', function (d) { return d.y0; })
      .attr('width', function (d) { return d.x1 - d.x0; })
      .attr('height', function (d) { return d.y1 - d.y0; })
    //   .style("stroke", "black")
      .style("fill", "slateblue")

  // and to add the text labels (TITLES)
  const label = svg
    .selectAll("text")
    .data(root.leaves())
    // .parent
    label
    .enter()
    .append("text")
        .attr("text-anchor", "middle")
        .text(function(d){ return d.data.name })
    .merge(label)
      .attr("x", function(d){ return d.x0+20})    // more right
      .attr("y", function(d){ return d.y0+10})    // lower
      .attr("font-size", "12px")
      // .attr("font-size", ((width+height)/2 * 0.001) + "em")
      .attr("fill", "white")

});
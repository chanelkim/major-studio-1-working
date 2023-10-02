// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 10, left: 10},
  width = 480 - margin.left - margin.right,
  height = 270 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select(".dataviz")
.append("svg")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("preserveAspectRatio", "xMidYMid meet")
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
      // .style("fill", "slateblue")

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

  // Append a tooltip.
  const format = d3.format(",d");
  leaf.append("title")
      .text(d => `${d.ancestors().reverse().map(d => d.data.name).join(".")}\n${format(d.value)}`);

    //FROM Observable's stdlib - "DOM.uid" (below)
    var count = 0;
    function uid(name) {
      return new Id("O-" + (name == null ? "" : name + "-") + ++count);
    }
    function Id(id) {
      this.id = id;
      this.href = new URL(`#${id}`, location) + "";
    }
    Id.prototype.toString = function() {
      return "url(" + this.href + ")";
    };

    //for COLOR
    const color = d3.scaleOrdinal(data.children.map(d => d.name), 
    d3.schemeTableau10);
    // d3.schemeGnBu[9]);
    // d3.schemeRdBu[8]);

  // Append a color rectangle. 
  leaf.append("rect")
      .attr("id", d => (d.leafUid = uid("leaf")).id)
      .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
      .attr("fill-opacity", 0.6)
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0);

  // Append a clipPath to ensure text does not overflow.
  leaf.append("clipPath")
      .attr("id", d => (d.clipUid = uid("clip")).id)
    .append("use")
      .attr("xlink:href", d => d.leafUid.href);

  // Append multiline text. The last line shows the value and has a specific formatting.
  leaf.append("text")
      .attr("clip-path", d => d.clipUid)
    .selectAll("tspan")
    .data(d => d.data.name.split(/(?=[A-Z][a-z])|\s+/g).concat(format(d.value)))
    .join("tspan")
      .attr("x", 3)
      .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
      .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
      .text(d => d);

  return Object.assign(svg.node(), {scales: {color}});
});
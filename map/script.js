// REFERENCES
// D3 Responsive Zoomable Treemap (D3 v4+) Aleksander Lenart; source: https://codepen.io/figle/pen/qapRZQ

// --------------------------------------------------------
// VARIABLES
// --------------------------------------------------------
const width = 1920;
const height = 1080;
const size = Math.min(width, height);
// const aspectRatio = "16:9";
// const viewBox = "0 0 " + aspectRatio.split(":").join(" ");

// Draw the map
function drawMap(us) {
  const land = topojson.feature(us, us.objects.states);
  const interiors = topojson.mesh(us, us.objects.states, (a, b) => a !== b);

  const zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", zoomed);

  const svg = d3
    .select("#map")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", "0 0 " + size + " " + size)
    // .attr("viewBox", "0 0 " + aspectRatio.split(":").join(" "))
    .attr("preserveAspectRatio", "xMidYMid meet")
    .on("click", reset);

  const path = d3.geoPath();

  const g = svg.append("g"); // group together with "g"

  //   let width = d3.select("svg").style("width");
  //   let height = d3.select("svg").style("height");
  //   width = width.substring(0, width.length - 2);
  //   height = height.substring(0, height.length - 2);

  const states = g
    .append("g")
    // .attr("transform", "translate(0,0)scale(1)")
    .attr("fill", "#444")
    .attr("cursor", "pointer")
    .selectAll("path")
    .data(land.features)
    .join("path")
    .on("click", clicked)
    .attr("d", path);

  states.append("title").text((d) => d.properties.name);

  g.append("path")
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-linejoin", "round")
    .attr("d", path(interiors));

  svg.call(zoom);

  //   // Calculate the bounds of the entire SVG content
  //   const bounds = g.node().getBBox();

  //   // Calculate the translation to center the content
  //   const translateX = (width - bounds.width) / 2 - bounds.x;
  //   const translateY = (height - bounds.height) / 2 - bounds.y;

  //   // Apply the calculated translation
  //   g.attr("transform", "translate(" + translateX + "," + translateY + ")");

  // --------------------------------------------------------
  // FUNCTIONS
  // --------------------------------------------------------

  function reset() {
    states.transition().style("fill", null);
    svg
      .transition()
      .duration(750)
      .call(
        zoom.transform,
        d3.zoomIdentity,
        d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
      );
  }

  function clicked(event, d) {
    const [[x0, y0], [x1, y1]] = path.bounds(d);
    event.stopPropagation();
    states.transition().style("fill", null);

    // Check the current zoom level
    const currentTransform = d3.zoomTransform(svg.node());
    const isZoomedIn = currentTransform.k !== 1;

    // Toggle between zooming in and zooming out
    if (isZoomedIn) {
      // Zoom out using the reset function
      reset();
    } else {
      // Zoom in
      d3.select(this).transition().style("fill", "red");
      svg
        .transition()
        .duration(750)
        .call(
          zoom.transform,
          d3.zoomIdentity
            .translate(width / 2, height / 2)
            .scale(
              Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height))
            )
            .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
          d3.pointer(event, svg.node())
        );
    }
  }

  function zoomed(event) {
    const { transform } = event;
    g.attr("transform", transform);
    g.attr("stroke-width", 1 / transform.k);
  }

  return svg.node();
}

// --------------------------------------------------------
// ASYNC LOAD DATA + DRAW MAP
// --------------------------------------------------------
async function loadData() {
  const us = await d3.json("data/us.json");
  console.log(us);
  drawMap(us);
}

loadData();

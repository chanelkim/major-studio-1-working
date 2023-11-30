// REFERENCES
// Zoom to bounding box, D3 Gallery Observable; source: https://observablehq.com/@d3/zoom-to-bounding-box

// --------------------------------------------------------
// VARIABLES
// --------------------------------------------------------
const width = 975;
const height = 610;

const geoObjectNone = {
  state: [
    "Alaska",
    "Arkansas",
    "Hawaii",
    "Idaho",
    "Indiana",
    "Mississippi",
    "Montana",
    "Nebraska",
    "Nevada",
    "North Carolina",
    "North Dakota",
    "Oklahoma",
    "Oregon",
    "South Dakota",
    "West Virginia",
    "Wyoming",
  ],
};

// Draw the map
function drawMap(us) {
  const land = topojson.feature(us, us.objects.states);
  const interiors = topojson.mesh(us, us.objects.states, (a, b) => a !== b);
  // const projection = d3.geoIdentity().fitSize([width, height], land);

  const zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", zoomed);

  const svg = d3
    .select("#map")
    .append("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("width", width)
    .attr("height", height)
    .attr("style", "max-width: 100%; height: auto;")
    .on("click", reset);

  const path = d3.geoPath().projection(scale(0.9, width, height));

  const g = svg.append("g"); // group together with "g"

  const states = g
    .append("g")
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

  // --------------------------------------------------------
  // FUNCTIONS
  // --------------------------------------------------------

  // Scale and center map: https://stackoverflow.com/questions/42430361/scaling-d3-v4-map-to-fit-svg-or-at-all
  function scale(scaleFactor, width, height) {
    return d3.geoTransform({
      point: function (x, y) {
        this.stream.point(
          (x - width / 2) * scaleFactor + width / 2,
          (y - height / 2) * scaleFactor + height / 2
        );
      },
    });
  }

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
              Math.min(8, 0.5 / Math.max((x1 - x0) / width, (y1 - y0) / height))
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

// REFERENCES
// Zoom to bounding box, D3 Gallery Observable; source: https://observablehq.com/@d3/zoom-to-bounding-box
// Scale and center map; source: https://stackoverflow.com/questions/42430361/scaling-d3-v4-map-to-fit-svg-or-at-all
// Advanced Mapmaking: Using d3, d3-scale and d3-zoom With Changing Data to Create Sophisticated Maps; source: https://soshace.com/advanced-mapmaking-using-d3-d3-scale-and-d3-zoom-with-changing-data-to-create-sophisticated-maps/

// --------------------------------------------------------
// VARIABLES
// --------------------------------------------------------
// let usdata = d3.json("data/us.json");
// let statecount = d3.json("data/stateCount.json");
// console.log(usdata);
// console.log(statecount);
const width = 975;
const height = 610;
let max;
let min;

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
function drawMap(us, statecount) {
  const land = topojson.feature(us, us.objects.states);
  // console.log("Topojson US:", land);

  // Merge the US state data and the state count data
  const mergedFeatures = _.map(land.features, (feature) => {
    const stateName = feature.properties.name;
    const matchingState = _.find(statecount, { geostate: stateName });
    // If matching state is found, merge the properties; otherwise, keep the original properties
    const mergedProperties = matchingState
      ? { ...feature.properties, ...matchingState }
      : feature.properties;
    return { ...feature, properties: mergedProperties };
  });
  const mergedGeoJSON = {
    type: "FeatureCollection",
    features: mergedFeatures,
  };
  console.log("Merged US:", mergedGeoJSON);
  merged = mergedGeoJSON;

  const interiors = topojson.mesh(us, us.objects.states, (a, b) => a !== b);

  const zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", zoomed);

  const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([min, max]);

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
    .data(merged.features)
    .join("path")
    .on("click", clicked)
    .attr("d", path)
    .attr("class", "state");

  states.append("title").text((d) => d.properties.name);

  // states
  //   .style("fill", (d) => colorScale(d.properties.contrcount))
  //   .on("mouseover", function (d) {
  //     d3.select(this).style(
  //       "fill",
  //       tinycolor(colorScale(d.properties.contrcount)).darken(10).toString()
  //     );
  //   })
  //   .on("mouseout", function (d) {
  //     d3.select(this).style("fill", colorScale(d.properties.contrcount));
  //   });
  // states.append("title").text((d) => d.properties.contrcount);

  g.append("path")
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-linejoin", "round")
    .attr("d", path(interiors));

  svg.call(zoom);

  // --------------------------------------------------------
  // FUNCTIONS
  // --------------------------------------------------------

  // Scale and center map
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
  const statecount = await d3.json("data/stateCount.json");
  const test = await d3.json("data/test.json");

  console.log("US geography data:", us);
  console.log("State count data:", statecount);
  drawMap(us, statecount);

  // RENAMING PROPERTY NAMES FOR OBJECT
  // console.log(test);
  // data = test;
  // let newArr = _.map(data, (era) => ({
  //   catalog_id: +era["catalogid"],
  //   themes: era["theme"],
  // }));
  // console.log(newArr);
}

loadData();
// drawMap(usdata, statecountdata);

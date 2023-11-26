// REFERENCES
// D3 Responsive Zoomable Treemap (D3 v4+) Aleksander Lenart; source: https://codepen.io/figle/pen/qapRZQ

let index;
let allArtists = [];
let hierarchicalData;

d3.json("data/IoAD_artists_imgs.json").then(function (data) {
  index = data;
  analyzeData();
  drawTreemap();
});

// Retrieve pertinent properties from the raw data
function analyzeData() {
  // go through the array of data
  index.forEach(function (n) {
    // match = false
    artistName = n.attribution;
    title = n.title;
    objectid = n.objectid;
    imagematch = n.imagematch;

    const artist = allArtists.find((p) => p.name === artistName);

    // check if it matches what we need
    if (!artist) {
      allArtists.push({
        name: artistName,
        titles: [
          {
            title: title,
            objectid: objectid,
            imagematch: imagematch,
          },
        ],
        count: 1, // initialize count to 1
      });
    } else {
      artist.titles.push({
        title: title,
        objectid: objectid,
        imagematch: imagematch,
      });
      artist.count++;
    }
  });

  function formatDataForHierarchy() {
    const hierarchyData = {
      name: "Artists", // Root node
      children: [],
    };
    allArtists.forEach(function (artist) {
      if (artist && artist.titles) {
        hierarchyData.children.push({
          name: artist.name || "Unknown artist", // use a default value if artist.name is undefined
          count: artist.count || 0, // use a default value if artist.count is undefined
          children: artist.titles.filter(Boolean).map((title) => ({
            // filter out undefined or null titles
            name: title,
            value: 1,
          })),
        });
      }
    });
    return hierarchyData;
  }

  hierarchicalData = formatDataForHierarchy();
  console.log("hierarchicalData:", hierarchicalData);
}

// COLORS
const customColors = [
  "#E63C28", // red
  "#F0D23C", // bright yellow
  "#F0B43C", // gold
  "#3282DC", // blue
  "#64281E", // brown
  "#E6B4BE", // pink
  "#3C5064", // metal
  "#C8D2DC", // grey
  "#505A32", // green
  "#C8D2DC", // grey
  "#5A50B4", // violet
];

const svgWidth = 1920;
const svgHeight = 1080;

let width = (height = 100); // % of the parent element
let x = d3.scaleLinear().domain([0, width]).range([0, width]);
let y = d3.scaleLinear().domain([0, height]).range([0, height]);

// Create a color scale with custom colors
let color = d3.scaleOrdinal().range(
  customColors.map(function (c) {
    c = d3.rgb(c);
    // c.opacity = 0.5;
    return c;
  })
);

function drawTreemap() {
  data = hierarchicalData;

  // Create a color scale with custom colors
  const color = d3.scaleOrdinal(
    data.children.map((d) => d.name),
    customColors
  );

  const svg = d3
    .select(".svg-container")
    .append("svg")
    .attr("viewBox", "0 0 " + svgWidth + " " + svgHeight)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g");

  const treemap = d3
    .treemap()
    .tile(d3.treemapBinary)
    .size([width, height])
    .paddingInner(0)
    .round(true);

  const nodes = d3
    .hierarchy(data)
    .sum((d) => (d.value ? 1 : 0))
    .sort((a, b) => b.height - a.height || b.value - a.value);
  console.log("nodes:", nodes);

  let currentDepth;
  treemap(nodes);

  chart = d3.select("#chart");
  const cells = chart
    .selectAll(".node")
    .data(nodes.descendants())
    .enter()
    .append("div")
    .attr("class", function (d) {
      return "node level-" + d.depth;
    })
    .attr("title", function (d) {
      return d.data.name ? d.data.name : "null";
    });
  console.log("cells:", cells);

  cells
    .style("left", function (d) {
      return x(d.x0) + "%";
    })
    .style("top", function (d) {
      return y(d.y0) + "%";
    })
    .style("width", function (d) {
      return x(d.x1) - x(d.x0) + "%";
    })
    .style("height", function (d) {
      return y(d.y1) - y(d.y0) + "%";
    })
    .style("background-color", function (d) {
      while (d.depth > 2) d = d.parent;
      return color(d.data.name);
    })
    .on("click", zoom);
  // .append("p")
  // .attr("class", "label")
  // .text(function (d) {
  //   return d.data.name ? d.data.name : "---";
  // });

  const parent = d3
    .select(".up")
    .datum(nodes)
    //   .on("click", zoom);
    .on("click", (event, d) => zoom(d));
  console.log("parent:", parent);

  if (nodes) {
    parent.datum(nodes).on("click", (event, d) => zoom(event, d));
  } else {
    console.error("Nodes data is not available.");
  }

  function zoom(event, d) {
    if (!d) {
      // Handle the case when 'd' is undefined
      console.error("Invalid data for zoom:", d);
      return;
    }
    console.log("zoom:", d);
    // http://jsfiddle.net/ramnathv/amszcymq/
    data = hierarchicalData;

    console.log("clicked: " + d.data.name + ", depth: " + d.depth);

    currentDepth = d.depth;
    parent.datum(d.parent || nodes);

    x.domain([d.x0, d.x1]);
    y.domain([d.y0, d.y1]);

    var t = d3.transition().duration(800).ease(d3.easeCubicOut);

    cells
      .transition(t)
      .style("left", function (d) {
        return x(d.x0) + "%";
      })
      .style("top", function (d) {
        return y(d.y0) + "%";
      })
      .style("width", function (d) {
        return x(d.x1) - x(d.x0) + "%";
      })
      .style("height", function (d) {
        return y(d.y1) - y(d.y0) + "%";
      });

    cells // hide this depth and above
      .filter(function (d) {
        return d.ancestors();
      })
      .classed("hide", function (d) {
        return d.children ? true : false;
      });

    cells // show this depth + 1 and below
      .filter(function (d) {
        return d.depth > currentDepth;
      })
      .classed("hide", false);
  }
}

let index;
let allArtists = [];
let hierarchicalData;

d3.json("data/IoAD_artists_imgs.json").then(function (data) {
  index = data;
  analyzeData();
  drawTreemap();
});

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
        titles: [title], // start with an array containing the current title
        count: 1, // initialize count to 1
      });
    } else {
      artist.titles.push(title);
      artist.count++;
    }
  });

  function formatDataForHierarchy() {
    const hierarchyData = {
      name: "Artists", // Root node
      children: [],
    };

    allArtists.forEach(function (artist, i) {
      hierarchyData.children.push({
        name: artist.name, // artist's name
        count: artist.count, // number of titles by the artist
        children: artist.titles.map((title) => ({
          name: title, // title as child node
          objectid: objectid,
          imagematch: imagematch,
          value: 1, //NEED THIS!! Gives weight to each rect (title) equally
          // value: i //weight according to position
        })),
      });
    });

    return hierarchyData;
  }

  hierarchicalData = formatDataForHierarchy();
}

// set the dimensions and margins of the graph
const margin = { top: 0, right: 0, bottom: 0, left: 0 },
  width = 1920 - margin.left - margin.right,
  height = 1080 - margin.top - margin.bottom;

// append the svg object to the body of the page
function drawTreemap() {
  // const color = d3.scaleOrdinal(hierarchicalData.children.map(d => d.name),
  // d3.schemeRdBu[8]);
  const color = d3.scaleOrdinal(
    hierarchicalData.children.map((d) => d.name),
    [
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
    ]
  );

  const svg = d3
    .select(".treemap")
    .append("svg")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g");

  // Compute the layout.
  const root = d3
    .treemap()
    .tile(d3.treemapBinary) // e.g., d3.treemapSquarify
    .size([width, height])
    .padding(1)
    .round(true)(
    d3
      .hierarchy(hierarchicalData)
      .sum((d) => d.value)
      .sort((a, b) => b.height - a.height || b.value - a.value)
  );

  const nodes = root.descendants();

  // use this information to add rectangles:
  const leaf = svg
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
    .attr("x", (d) => d.x0)
    .attr("y", (d) => d.y0)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .style("fill", (d) => color(d.parent.data.name));

  console.log(hierarchicalData);
}

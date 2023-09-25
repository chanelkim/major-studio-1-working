let index;
let allArtists = [];
let hierarchicalData;

d3.json('data/IoAD.json').then(function(data){
    index = data;
    analyzeData();
    drawTreemap();
  });

function analyzeData(){
// // go through the array of data
index.forEach(function(n) {
    // match = false
    artistName = n.attribution;
    title = n.title;
    objectID = n.objectid;  

    const artist = allArtists.find((p) => p.name === artistName); //CHAT GPT: rewrite

    // check if it matches what we need
    if(!artist){
        allArtists.push({
        name: artistName,
        titles: [title], //CHAT GPT: start with an array containing the current title
        count: 1 //CHAT GPT: initialize count to 1
    });
    } 
    else {
        artist.titles.push(title);
        artist.count++;
    }
    });

    function formatDataForHierarchy() {
        const hierarchyData = {
            name: "Artists", // Root node
            children: []        };

        allArtists.forEach(function (artist, i) {
            hierarchyData.children.push({
                name: artist.name, // Artist's name
                count: artist.count, // Number of titles by the artist
                children: artist.titles.map((title) => ({
                    name: title, // Title as child node
                value: 1 //NEED THIS!! Gives weight to each rect (title) equally
                // value: i //weight according to position
                }))
            });
        });

        return hierarchyData;
    };

hierarchicalData = formatDataForHierarchy();
};

// set the dimensions and margins of the graph
const margin = {top: 10, right: 10, bottom: 10, left: 10},
  width = 1920 - margin.left - margin.right,
  height = 1080 - margin.top - margin.bottom;

// append the svg object to the body of the page
function drawTreemap() {

    const color = d3.scaleOrdinal(hierarchicalData.children.map(d => d.name), 
    // d3.schemeTableau10);
    // d3.schemeGnBu[9]);
    d3.schemeRdBu[8]);

    const svg = d3.select("#dataviz")
        .append("svg")
            .attr("viewBox", "0 0 " + width + " " + height)
            .attr("preserveAspectRatio", "xMidYMid meet")
        .append("g")

  // Compute the layout.
  const root = d3.treemap()
    .tile(d3.treemapBinary) // e.g., d3.treemapSquarify
    .size([width, height])
    .padding(1)
    .round(true)
  (d3.hierarchy(hierarchicalData)
      .sum(d => d.value)
      .sort((a, b) => b.height - a.height || b.value - a.value));

    const nodes = root.descendants();

  // use this information to add rectangles:
    const leaf = svg
        .selectAll("rect")
        .data(root.leaves())
        .enter()
        .append("rect")
        .attr('x', d => d.x0)
        .attr('y', d => d.y0)
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .style("fill", d => color(d.parent.data.name));
        // .style("fill", "slateblue")

    // // and to add the text labels (TITLES)
    // const label = svg
    //     .selectAll("text")
    //     .data(root.leaves())
    //     // .parent
    //     label
    //     .enter()
    //     .append("text")
    //         .attr("text-anchor", "middle")
    //         .attr("x", d => (d.x0 + d.x1) / 2)
    //         .attr("y", d => (d.y0 + d.y1) / 2)
    //         .attr("font-size", "15px")
    //         .attr("fill", "white")
    //         .text(d => d.data.name);
    //         // .attr("font-size", ((width+height)/2 * 0.001) + "em")
    console.log(hierarchicalData)
};
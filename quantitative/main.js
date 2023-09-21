let index;
let allArtists = [];

d3.json('data/IoAD.json').then(function(data){
    index = data;
    analyzeData();
    drawTreemap();
  });

function analyzeData(){
// go through the array of data
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

// sort by amount of items in the list
allArtists.sort( (a,b) => a.count-b.count )
allArtists.reverse();

console.log(allArtists)
};

function drawTreemap() {
//SOURCE: https://observablehq.com/@d3/treemap/2 (JSON), https://observablehq.com/@d3/treemap-stratify (CSV)
    // // Specify the chart’s dimensions.
    // const width = 1154;
    // const height = 1154;
        // define dimensions and margins for the graphic
        const margin = ({top: 100, right: 50, bottom: 100, left: 80})
        const width = window.innerWidth;
        const height = window.innerHeight;
  
//     // Specify the color scale.
//     // const color = d3.scaleOrdinal(data.children.map(d => d.attribution), d3.schemeTableau10);
  
//     // Compute the layout.
//     const root = d3.treemap()
//       .tile(tile) // e.g., d3.treemapSquarify
//       .size([width, height])
//       .padding(1)
//       .round(true)
//     (d3.hierarchy(data)
//         .sum(d => d.value)
//         .sort((a, b) => b.value - a.value));
  
    // ---- append SVG object ----
    const svg = d3.select("#dataviz svg")
    svg
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .data(allArtists)

//     // Create the SVG container.
//     const svg = d3.create("svg");
//     svg
//         .attr("viewBox", [0, 0, width, height])
//         .attr("width", width)
//         .attr("height", height)
//         .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

    // ---- append SVG object ----
    const root = d3.hierarchy(allArtists).sum(function(d){ return d.count}) // Here the size of each leave is given in the 'value' field in input data

    // ---- Then d3.treemap computes the position of each element of the hierarchy ----
    d3.treemap()
    .size([width, height])
    .padding(2)
    (root)

    // ---- use this information to add rectangles: ----
    svg
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .style("stroke", "black")
        .style("fill", "slateblue")

//     // Add a cell for each leaf of the hierarchy.
//     const leaf = 
//     svg
//         .selectAll("g")
//         .data(root.leaves())
//         .join("g")
//         .attr("transform", d => `translate(${d.x0},${d.y0})`);
  
//     // Append a tooltip.
//     const format = d3.format(",d");
//     leaf
//         .append("title")
//             .text(d => `${d.ancestors().reverse().map(d => d.data.attribution).join(".")}\n${format(d.value)}`);
  
//     // Append a color rectangle. 
//     leaf
//         .append("rect")
//             .attr("id", d => (d.leafUid = DOM.uid("leaf")).id)
//             .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.attribution); })
//             .attr("fill-opacity", 0.6)
//             .attr("width", d => d.x1 - d.x0)
//             .attr("height", d => d.y1 - d.y0);
  
//     // Append a clipPath to ensure text does not overflow.
//     leaf
//         .append("clipPath")
//             .attr("id", d => (d.clipUid = DOM.uid("clip")).id)
//         .append("use")
//             .attr("xlink:href", d => d.leafUid.href);
  
//     // Append multiline text. The last line shows the value and has a specific formatting.
//     leaf
//         .append("text")
//             .attr("clip-path", d => d.clipUid)
//             .selectAll("tspan")
//             .data(d => d.data.attribution.split(/(?=[A-Z][a-z])|\s+/g).concat(format(d.value)))
//             .join("tspan")
//             .attr("x", 3)
//             .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
//             .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
//             .text(d => d);
  
//     // return Object.assign(svg.node(), {scales: {color}});
//     return Object.assign(svg.node());
};
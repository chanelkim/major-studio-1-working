// SOURCE: https://d3-graph-gallery.com/graph/network_basic.html
// set the dimensions and margins of the graph
var margin = { top: 40, right: 40, bottom: 40, left: 40 };
// Get the dimensions of the user's screen
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;

// Calculate the width and height of the chart area, taking into account the margins
var width = screenWidth - margin.left - margin.right;
var height = screenHeight - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3
  .select("#my_dataviz")
  .append("svg")
  .attr("width", screenWidth)
  .attr("height", screenHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

try {
  d3.json("data/test/reformatted_data.json", function (data) {
    // ------------ INITIALIZE LINKS ------------
    var link = svg
      .selectAll("line")
      .data(data.links)
      .enter()
      .append("line")
      .style("stroke", "#aaa")
      .attr("shared_words", function (d) {
        return d.shared_words.join(", "); // Convert the shared words array to a string
      });
    console.log(data.links);

    // ------------ LINKS TOOLTIP ------------
    link.append("title").text(function (d) {
      return "Shared Words: " + d.shared_words.join(", ");
    });

    // ------------ SCALE PREP FOR NODES ------------
    // Calculate the maximum shared word count in your data
    var maxSharedWords = d3.max(data.links, function (d) {
      return d.shared_words ? d.shared_words.length : 0;
    });
    console.log("Max shared words: ", maxSharedWords);

    data.links.forEach(function (d) {
      console.log(
        "Shared Words for " +
          d.source +
          ": " +
          d.shared_words +
          " " +
          (d.shared_words ? d.shared_words.length : 0)
      );
    });

    // Define a linear scale with the calculated domain
    var wordCountScale = d3
      .scaleLinear()
      .domain([0, maxSharedWords])
      // .domain([0, 10])
      .range([10, maxSharedWords * 1.1]); // Adjust the range values as needed

    // ------------ INITIALIZE NODES ------------
    var node = svg
      .selectAll("circle")
      .data(data.links)
      .enter()
      .append("circle")
      // .attr("r", 20)
      .attr("r", function (d) {
        if (d.shared_words) {
          return wordCountScale(d.shared_words.length);
        } else {
          return 0; // or a default size if there are no shared words
        }
      })
      .style("fill", "#69b3a2");
    console.log(data.nodes);
    // Create an SVG group for controlling the size of the circles

    // --- ATTEMPT TO CREATE SEPARATE NODES FOR SIZE AND POSITION ---
    // // Create a group for node size
    // var nodeSize = svg
    //   .selectAll(".node-size")
    //   .data(data.links)
    //   .enter()
    //   .append("circle")
    //   .attr("class", "node-size")
    //   .attr("r", function (d) {
    //     if (d.shared_words) {
    //       return wordCountScale(d.shared_words.length);
    //     } else {
    //       return 0; // or a default size if there are no shared words
    //     }
    //   })
    //   .style("fill", "#69b3a2");

    // // Create a group for node position
    // var nodePosition = svg
    //   .selectAll(".node-position")
    //   .data(data.nodes)
    //   .enter()
    //   .append("circle")
    //   .attr("class", "node-position")
    //   .attr("r", 0) // Initialize with zero radius
    //   .style("fill", "#69b3a2");

    // Add labels to the nodes
    var nodeLabels = svg
      .selectAll("text")
      .data(data.nodes)
      .enter()
      .append("text")
      .text(function (d) {
        return d.name;
      })
      .attr("dy", -25) // Adjust the label position (vertical offset)
      .style("text-anchor", "middle") // Center the text on the node
      .style("fill", "#000000");

    // Let's list the force we wanna apply on the network
    var simulation = d3
      .forceSimulation(data.nodes) // Force algorithm is applied to data.nodes
      .force(
        "link",
        d3
          .forceLink() // This force provides links between nodes
          .id(function (d) {
            return d.id;
          }) // This provide  the id of a node
          .links(data.links) // and this the list of links
          .distance(screenWidth / 3)
      )
      .force("charge", d3.forceManyBody().strength(-400)) // This adds repulsion between nodes. Play with the -400 for the repulsion strength
      .force("center", d3.forceCenter(width / 2, height / 2)) // This force attracts nodes to the center of the svg area
      .on("tick", ticked);
    // .strength(-800);

    // This function is run at each iteration of the force algorithm, updating the nodes position.
    function ticked() {
      link
        .attr("x1", function (d) {
          return d.source.x;
        })
        .attr("y1", function (d) {
          return d.source.y;
        })
        .attr("x2", function (d) {
          return d.target.x;
        })
        .attr("y2", function (d) {
          return d.target.y;
        });

      node
        .attr("cx", function (d) {
          return d.x;
        })
        .attr("cy", function (d) {
          return d.y;
        });

      // nodePosition
      //   .attr("cx", function (d) {
      //     return d.x;
      //   })
      //   .attr("cy", function (d) {
      //     return d.y;
      //   });

      // nodeSize
      //   .attr("cx", function (d) {
      //     return d.x;
      //   })
      //   .attr("cy", function (d) {
      //     return d.y;
      //   });

      // Update the node label positions
      nodeLabels
        .attr("x", function (d) {
          return d.x;
        })
        .attr("y", function (d) {
          return d.y; // Adjust the vertical position of the label
        });
    }
  });
} catch (error) {
  console.error("D3.js error:", error);
}

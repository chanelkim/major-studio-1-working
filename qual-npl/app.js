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

// Select the button element by its ID
const loadButton = document.getElementById("load-json-button");

// Select the UL element for displaying the keys
const keyList = document.getElementById("key-list");

// Add a click event listener to the button
loadButton.addEventListener("click", () => {
  // Define the path to your JSON file
  const jsonFilePath = "data/textLinks-results.json";

  // Use D3.js to load the JSON file
  d3.json(jsonFilePath).then((data) => {
    // Log the loaded JSON object to the console
    console.log(data);

    // Extract the keys of the JSON object
    const keys = Object.keys(data);

    // Clear any previous content from the list
    keyList.innerHTML = "";

    // Create list items for each key and append them to the UL
    keys.forEach((key) => {
      const listItem = document.createElement("p");
      listItem.textContent = key;
      keyList.appendChild(listItem);
    });
  });
});

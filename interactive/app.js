/* ------------------ CATALOG ------------------*/

const THEME = "theme";
const CATEGORY = "category";
const SUBCATEGORY = "subcategory";
const TYPE = "type";
const SECTION = "section";
const TOOLTIP_WIDTH = 150;
const TOOLTIP_HEIGHT = 20;

// STATE SCHEMA
let state = {
  data: [],
  filters: {
    menu: [],
    checked: [],
  },
  tooltip: {
    value: "",
    visible: false,
    coordinates: [0, 0],
  },
  dimensions: [window.innerWidth, window.innerHeight],
  radioButtonMenu: {
    selectedOption: null,
  },
  treemapSVG: {
    data: null,
  },
  mapSVG: {
    mapData: null,
  },
};

// LOAD DATA
async function dataLoad() {
  try {
    // Load data asynchronously
    const catalogData = await d3.json("data/catalog_cleaned.json");
    // once data is on state, we can access it from any other function because state is a global variable
    // Data has been loaded successfully, you can now work with the data
    processData(catalogData);
    initializeLayout(catalogData);
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

function initializeLayout(data) {
  // Perform layout initialization here
  // Called before the asynchronous operation (d3.json) to set up the layout
  const radioGroup = document.getElementById("radioGroup");

  data.forEach((item) => {
    // Iterate through properties like 'theme', 'category', 'subcategory', 'type'
    Object.keys(item).forEach((property) => {
      if (Array.isArray(item[property])) {
        // For array properties, create radio buttons for each item in the array
        item[property].forEach((value, index) => {
          const radioInput = document.createElement("input");
          radioInput.type = "radio";
          radioInput.className = "btn-check";
          radioInput.name = property; // Set the radio button group name to the property name
          radioInput.id = `${property}_${index}`;
          radioInput.autocomplete = "off";
          radioInput.setAttribute("data-label", value);

          const label = document.createElement("label");
          label.className = "btn btn-outline-primary text-dark";
          label.htmlFor = `${property}_${index}`;
          label.textContent = value;
          // data.forEach((item) => {
          //   const radioInput = document.createElement("input");
          //   radioInput.type = "radio";
          //   radioInput.className = "btn-check";
          //   radioInput.name = "options";
          //   radioInput.id = "option" + item.id;
          //   radioInput.autocomplete = "off";
          //   radioInput.setAttribute("data-label", item.theme); // Use the "text" key as the label

          //   const label = document.createElement("label");
          //   label.className = "btn btn-outline-primary text-dark";
          //   label.htmlFor = "option" + item.id;
          //   label.textContent = item.theme;

          radioGroup.appendChild(radioInput);
          radioGroup.appendChild(label);
        });
      }
    });
  });
  console.log("Initializing layout...");
}

function processData(data) {
  // Process and use the loaded data here
  console.log("Data loaded:", data);
}
// Call the dataLoad function to initiate the process
dataLoad();

// Set initial label texts
document.querySelectorAll(".btn-check").forEach(function (element) {
  var labelElement = document.querySelector('label[for="' + element.id + '"]');

  if (labelElement) {
    element.addEventListener("change", function () {
      labelElement.textContent = data.find(
        (item) => "option" + item.id === this.id
      ).section;
    });
  }
});

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

    // Group themes by section
    const groupedData = groupDataBySection(catalogData);

    // Set up the layout before we have data
    initializeLayout(groupedData);

    // Data has been loaded successfully, you can now work with the data
    processData(catalogData);
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

// Function to group themes by section
function groupDataBySection(data) {
  const groupedData = {};

  data.forEach((item) => {
    const section = item.section;

    if (!groupedData[section]) {
      groupedData[section] = [];
    }

    groupedData[section].push(item);
  });

  return groupedData;
}

// Function to set up the layout
function initializeLayout(groupedData) {
  const radioGroupContainer = document.getElementById("radioGroup");

  Object.keys(groupedData).forEach((section) => {
    const colDiv = document.createElement("div");
    colDiv.className = "col-12";

    const fieldset = document.createElement("fieldset");
    fieldset.className = "row";

    const addedThemes = new Set();

    groupedData[section].forEach((item, index) => {
      item.theme.forEach((theme) => {
        // Check if the theme has been added to the set
        if (!addedThemes.has(theme)) {
          const radioInput = document.createElement("input");
          radioInput.type = "radio";
          radioInput.className = "btn-check col";
          radioInput.name = "options"; // Use the same name for all radio buttons
          radioInput.id = `option_${theme}_${index}`;
          radioInput.autocomplete = "off";
          radioInput.setAttribute("data-label", theme);

          const label = document.createElement("label");
          label.className = "btn btn-outline-primary text-dark col";
          label.htmlFor = `option_${theme}_${index}`;
          label.textContent = theme;

          fieldset.appendChild(radioInput);
          fieldset.appendChild(label);

          // Add the theme to the set to avoid duplication
          addedThemes.add(theme);

          // Add a click event to toggle the active class
          radioInput.addEventListener("click", toggleActiveClass);
        }
      });
    });

    colDiv.appendChild(fieldset);
    radioGroupContainer.appendChild(colDiv);
  });

  console.log("Initializing layout...");
}

// Function to toggle the active class
function toggleActiveClass(event) {
  // Find all radio buttons
  const radioButtons = document.querySelectorAll('input[type="radio"]');

  // Remove the "active" class from all radio buttons
  radioButtons.forEach((radio) => {
    radio.classList.remove("active");
  });

  // Toggle the "active" class for the clicked radio button
  if (event.currentTarget.tagName === "INPUT") {
    event.currentTarget.classList.toggle("active");
  }
}

/* NEXT STEP: NEED TO UPDATE/DEBUG THIS FUNCTION TO DISPLAY ARRAY ITEMS */
// Function to update visibility of related categories, subcategories, and types based on the selected theme
function updateVisibility(selectedTheme, themeRelations) {
  console.log("Selected Theme:", selectedTheme);

  // Hide all radios initially
  const allRadios = document.querySelectorAll('input[type="radio"]');
  allRadios.forEach((radio) => (radio.style.display = "none"));

  const relatedCategories = themeRelations.get(selectedTheme).categories;
  const relatedSubcategories = themeRelations.get(selectedTheme).subcategories;
  const relatedTypes = themeRelations.get(selectedTheme).types;

  console.log("Related Categories:", relatedCategories);
  console.log("Related Subcategories:", relatedSubcategories);
  console.log("Related Types:", relatedTypes);

  // Function to update display property for a set of radios
  function updateDisplay(radioNames) {
    radioNames.forEach((radioName) => {
      const radios = document.querySelectorAll(`input[name="${radioName}"]`);
      console.log(`Updating display property for ${radioName} radios`);

      radios.forEach((radio) => {
        // Only show radios that are related to the selected theme
        if (radio.getAttribute("data-theme") === selectedTheme) {
          radio.style.display = "block";
        } else {
          radio.style.display = "none";
        }
      });
    });
  }

  // Show radios corresponding to the selected theme
  updateDisplay(relatedCategories);
  updateDisplay(relatedSubcategories);
  updateDisplay(relatedTypes);
}

// Function to set initial label texts
function setInitialLabelTexts(data) {
  document.querySelectorAll(".btn-check").forEach(function (element) {
    var labelElement = document.querySelector(
      'label[for="' + element.id + '"]'
    );

    if (labelElement) {
      element.addEventListener("change", function () {
        labelElement.textContent = data.find(
          (item) => "option" + item.id === this.id
        ).section;
      });
    }
  });
}

/* NEXT STEP: NEED TO CONNECT OBJECTS TO BUTTONS */
function processData(data) {
  // Process and use the loaded data here
  console.log("Data loaded:", data);
}

/* INITITATE ASYNC DATA LOAD */
// Call the dataLoad function to initiate the process
dataLoad();

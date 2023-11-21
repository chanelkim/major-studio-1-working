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
  // data: [],
  // filters: {
  //   menu: [],
  //   checked: [],
  // },
  // tooltip: {
  //   value: "",
  //   visible: false,
  //   coordinates: [0, 0],
  // },
  // dimensions: [window.innerWidth, window.innerHeight],
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

/* LOAD DATA ------------------*/
let catalogData;

async function dataLoad() {
  try {
    // Load data asynchronously
    objectData = await d3.json("data/IoAD_artists_imgs.json");
    catalogData = await d3.json("data/catalog_cleaned.json");

    // Group themes by section
    const groupedData = groupDataBySection(catalogData);
    // Map themes to subsections
    const themeRelations = relateThemes(catalogData);

    // Set up the layout before we have data
    initializeLayout(groupedData, themeRelations);

    // Data has been loaded successfully, you can now work with the data
    processData(catalogData);
    processData(objectData);
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

/* 1. CATALOG ------------------
related FUNCTIONS for organizing CATALOG DATA ------------------*/
// Function to group themes by section ------------------
function groupDataBySection(data) {
  const groupedData = {};

  data.forEach((item) => {
    const section = item.section;

    if (!groupedData[section]) {
      groupedData[section] = [];
    }

    groupedData[section].push(item);
  });
  console.log("Sections:", groupedData);
  return groupedData;
}

// Function to relate themes to category, subcategory, type ------------------
function relateThemes(data) {
  // Create a map to associate themes with their related categories, subcategories, and types
  const themeRelations = new Map();

  data.forEach((item) => {
    const catalogID = item.catalogid;

    item.theme.forEach((theme) => {
      // Check if the theme already exists in the map
      if (!themeRelations.has(theme)) {
        themeRelations.set(theme, {
          theme: [theme],
          category: [],
          subcategory: [],
          type: [],
        });
      }

      // Add categories, subcategories, and types to the theme entry only if they include the theme
      if (item.category.some((category) => category.includes(theme))) {
        themeRelations.get(theme).category.push(...item.category);
        themeRelations.get(theme).subcategory.push(...item.subcategory);
        themeRelations.get(theme).type.push(...item.type);
      } else {
        // If category does not include theme, add only matching subcategories and types
        themeRelations
          .get(theme)
          .subcategory.push(
            ...item.subcategory.filter((subcategory) =>
              subcategory.includes(theme)
            )
          );
        themeRelations
          .get(theme)
          .type.push(...item.type.filter((type) => type.includes(theme)));
      }
    });
  });

  // Convert arrays to sets to remove duplicates
  themeRelations.forEach((value) => {
    value.category = [...new Set(value.category)];
    value.subcategory = [...new Set(value.subcategory)];
    value.type = [...new Set(value.type)];
  });

  console.log("Theme relationships:", themeRelations);
  return themeRelations;
}

/* INITIALIZE LAYOUT ------------------*/
// Function to set up the layout ------------------
function initializeLayout(groupedData, themeRelations) {
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

          // Add a click event to toggle the active class and visibility of related arrays
          radioInput.addEventListener("change", () => {
            const selectedTheme = theme;
            // Toggle the visibility of category, subcategory, and type based on the selected theme
            toggleVisibility(selectedTheme, themeRelations);

            // Toggle the "active" class for the clicked radio button
            const radioButtons = document.querySelectorAll(
              'input[name="options"]'
            );
            radioButtons.forEach((radio) => {
              radio.classList.remove("active");
            });

            radioInput.classList.toggle("active");
          });
        }
      });
    });
    colDiv.appendChild(fieldset);
    radioGroupContainer.appendChild(colDiv);
  });

  // Add a container for the related radios
  const relatedRadiosContainer = document.createElement("div");
  relatedRadiosContainer.id = "relatedRadios";
  relatedRadiosContainer.className = "col-12";
  radioGroupContainer.appendChild(relatedRadiosContainer);

  console.log("Initializing layout...");
}

/* related FUNCTIONS for RADIO BUTTONS ------------------*/
// Function to update visibility of category, subcategory, and type based on the selected theme ------------------
function toggleVisibility(selectedTheme, themeRelations) {
  console.log("Selected Theme:", selectedTheme);
  // Get the container where the new radio buttons will be appended
  const container = document.getElementById("relatedRadios");

  // Clear any existing radio buttons in the container
  container.innerHTML = "";

  // Get the related themes based on the selected theme
  const relatedThemes = themeRelations.get(selectedTheme);
  console.log("Relationships:", relatedThemes);

  const relatedCategories = themeRelations.get(selectedTheme).category;
  const relatedSubcategories = themeRelations.get(selectedTheme).subcategory;
  const relatedTypes = themeRelations.get(selectedTheme).type;

  // Display related category radios
  console.log("Related Category:", relatedCategories);
  relatedCategories.forEach((category) => {
    createRadioButton(container, "category", category);
  });

  // Display related subcategory radios
  console.log("Related Subcategory:", relatedSubcategories);
  relatedSubcategories.forEach((subcategory) => {
    createRadioButton(container, "subcategory", subcategory);
  });

  // Display related type radios
  console.log("Related Type:", relatedTypes);
  console.log("---------------------------");
  relatedTypes.forEach((type) => {
    createRadioButton(container, "type", type);
  });

  // Show radios corresponding to the selected theme
  if (selectedTheme) {
    // const relatedCategory = relatedThemes.category;
    // console.log(relatedCategory);
    // const relatedSubcategories = relatedThemes.subcategory;
    // const relatedTypes = relatedThemes.type;

    // Helper function to handle the click event for new radio buttons
    const handleRadioButtonClick = (value) => {
      console.log("New radio button clicked:", value);
    };

    // Display related category radios
    relatedCategories.forEach((category) => {
      const radio = document.querySelector(
        `input[name="category"][data-label="${category}"]`
      );
      if (radio) {
        radio.style.display = "inline-block";
        // Add a click event to the new radio button
        radio.addEventListener("change", () =>
          handleRadioButtonClick(category)
        );
      }
    });

    // Display related subcategory radios
    relatedSubcategories.forEach((subcategory) => {
      const radio = document.querySelector(
        `input[name="subcategory"][data-label="${subcategory}"]`
      );
      if (radio) {
        radio.style.display = "inline-block";
        // Add a click event to the new radio button
        radio.addEventListener("change", () =>
          handleRadioButtonClick(subcategory)
        );
      }
    });

    // Display related type radios
    relatedTypes.forEach((type) => {
      const radio = document.querySelector(
        `input[name="type"][data-label="${type}"]`
      );
      if (radio) {
        radio.style.display = "inline-block";
        // Add a click event to the new radio button
        radio.addEventListener("change", () => handleRadioButtonClick(type));
      }
    });
  }
}

// Function to create and append a radio button to the specified container ------------------
// function createRadioButton(container, name, label) {
//   const radioInput = document.createElement("input");
//   radioInput.type = "radio";
//   radioInput.className = "btn-check col";
//   radioInput.name = name;
//   radioInput.autocomplete = "off";
//   radioInput.setAttribute("data-label", label);

//   const radioLabel = document.createElement("label");
//   radioLabel.className = "btn btn-outline-primary text-dark col";
//   radioLabel.htmlFor = `${name}_${label}`;
//   radioLabel.textContent = label;

//   container.appendChild(radioInput);
//   container.appendChild(radioLabel);
// }
function createRadioButton(container, groupName, catalogId, value) {
  const radioInput = document.createElement("input");
  const uniqueId = `${groupName}_${catalogId}_${value}`;
  radioInput.type = "radio";
  radioInput.name = groupName;
  radioInput.value = value;
  radioInput.id = uniqueId;

  const label = document.createElement("label");
  label.htmlFor = uniqueId;
  label.textContent = value;

  container.appendChild(radioInput);
  container.appendChild(label);

  // // Add a click event to the new radio button
  // radioInput.addEventListener("change", () => handleRadioButtonClick(value));
}

/* NEXT STEP: NEED TO CONNECT OBJECTS TO BUTTONS */
function processData(data) {
  // Process and use the loaded data here
  console.log("Data loaded:", data);
}

/* INITITATE ASYNC DATA LOAD */
// Call the dataLoad function to initiate the process
dataLoad();

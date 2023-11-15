// // Example of setting and updating label text from data-* attribute using JavaScript
// document.querySelectorAll(".btn-check").forEach(function (element) {
//   var labelElement = document.querySelector('label[for="' + element.id + '"]');

//   if (labelElement) {
//     var labelData = JSON.parse(element.getAttribute("data-label"));
//     labelElement.textContent = labelData.text;

//     element.addEventListener("change", function () {
//       var selectedLabelData = JSON.parse(this.getAttribute("data-label"));
//       labelElement.textContent = selectedLabelData.text;
//       console.log("Selected label data:", labelData);
//     });
//   }
// });

// Fetch JSON data from the file
fetch("data/cleaned_sections_tokens.json")
  .then((response) => response.json())
  .then((data) => {
    // Create radio buttons and labels dynamically based on JSON data
    const radioGroup = document.getElementById("radioGroup");

    data.forEach((item) => {
      const radioInput = document.createElement("input");
      radioInput.type = "radio";
      radioInput.className = "btn-check";
      radioInput.name = "options";
      radioInput.id = "option" + item.id;
      radioInput.autocomplete = "off";
      radioInput.setAttribute("data-label", item.section); // Use the "text" key as the label

      const label = document.createElement("label");
      label.className = "btn btn-outline-primary text-dark";
      label.htmlFor = "option" + item.id;
      label.textContent = item.section;

      radioGroup.appendChild(radioInput);
      radioGroup.appendChild(label);
    });

    // Set initial label texts
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
      //   if (labelElement) {
      //     var labelData = JSON.parse(element.getAttribute("data-label"));
      //     labelElement.textContent = labelData.text;

      //     element.addEventListener("change", function () {
      //       var selectedLabelData = JSON.parse(this.getAttribute("data-label"));
      //       labelElement.textContent = selectedLabelData.text;
      //     });
      //   }
    });
  })
  .catch((error) => console.error("Error loading JSON data:", error));

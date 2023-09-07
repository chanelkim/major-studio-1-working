/*
  Exercise 3
  DOM manipulation with vanilla JS
*/

// Task
// What does DOM stand for?
console.log("DOM stands for document object model");

// Task
// Open the file index.html in AWS Cloud9. Click "Preview" > "Preview File index.html". (Note that you can open it in a new window). What do you see?
console.log(
  "Using VSCode and live server, I see an add element button and a pink vertical rectangle"
);
// If you are working locally, navigate to the excercise directory and start a python http server `python3 -m http.server 900`, press Control-c to stop the server

// Task
// Delete the div with the class rectangle from index.html and refresh the preview.
const elementToDelete = document.querySelector(".rectangle");
elementToDelete.parentNode.removeChild(elementToDelete);

// Task
// What does the following code do?
const viz = document.body.querySelector(".viz");
const button = document.body.querySelector("#button");
console.log(
  `The following code assigns divs from the HTML with a variable name that can be called and appended or added to`
);

console.log(viz, viz.children);

// const addChildToViz = () => {
  const addChildToViz = (data) => { //IN-CLASS: this is how to connect dataset to this function
  const newChild = document.createElement("div");
  newChild.className = "rectangle";
  // newChild.style.height = Math.random() * 100 + "px";
  // newChild.style.height = data.petallength * 20 + "px"; //IN-CLASS: changing math.random to data, adjusting scale; doesn't have access to data, so add as parameter
    newChild.style.height = data * 20 + "px"; //IN-CLASS: removing ".petallength" makes this more general
  viz.appendChild(newChild);
};

// Task
// Modify index.html to make this event listener work
button.addEventListener("click", addChildToViz);
console.log(`no modifications were necessary in the index.html file`);

// Task
// Where can you see the results of the console.log below? How is it different from in previous exercises?
console.log(`The data is seen as an array of 150 objects`);

// function drawIrisData() {
//   window
//     .fetch("./iris_json.json")
//     .then((data) => data.json())
//     .then((data) => {
//       // ----------- CREATES TABLE ---------
//       // Get the 'irisData' div element
//       const irisDataDiv = document.getElementById("irisData");

//       // Create a table to display the Iris data
//       const table = document.createElement("table");

//       // Create table header
//       const headerRow = table.insertRow(0);
//       for (const key in data[0]) {
//         if (data[0].hasOwnProperty(key)) {
//           const th = document.createElement("th");
//           th.textContent = key;
//           headerRow.appendChild(th);
//         }
//       }

//       // Create table rows and cells for the data
//       data.forEach((iris, index) => {
//         const row = table.insertRow(index + 1);
//         for (const key in iris) {
//           if (iris.hasOwnProperty(key)) {
//             const cell = row.insertCell();
//             cell.textContent = iris[key];
//           }
//         }
//       });

//       // Append the table to the 'irisData' div
//       irisDataDiv.appendChild(table);

//       console.log(data);
//     });
// }

// drawIrisData();

// Task
// Modify the code above to visualize the Iris dataset in the preview of index.html.
// Feel free to add additional CSS properties in index.html, or using JavaScript, as you see fit.
/*created a table of data values using chat GPT (accessed Sep 4, 2023)*/

/*IN-CLASS, drawing using the iris dataset*/
function drawIrisData() {
  window
    .fetch("./iris_json.json")
    .then(data => data.json())
    .then(data => {
      console.log(data);
      data.forEach(callThatAnything => {
        // addChildToViz(callThatAnything);
        addChildToViz(callThatAnything.petallength);
      }
      )
    });
}

drawIrisData();
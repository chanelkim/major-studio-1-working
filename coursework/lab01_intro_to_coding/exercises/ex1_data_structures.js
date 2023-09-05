/*
  Exercise 1
  JavaScript data structures & functions
*/

var names = [
  "Rubin Museum",
  "The Cooper Hewitt (Smithsonian)",
  "The Morgan Library and Museum",
  "The Whitney Museum of American Art",
  "The Frick Collection",
  "American Museum of Natural History",
];

var URLs = [
  "rubinmuseum.org",
  "cooperhewitt.org",
  "themorgan.org",
  "whitney.org",
  "frick.org",
  "amnh.org",
];

var years = [2004, 1896, 1924, 1930, 1935, 1869];

// Task 1
// Console log the length of each Array
console.log(names.length);
console.log(URLs.length);
console.log(years.length);

// // Task 2
// // add a new item to an array
var newName = "The International Center of Photography";
var newURL = "icp.org";
var newYear = 1974;

console.log(names.push(newName));
console.log(names);
// URLs[6] = newURL; //Add an Array Element at a Particular Index Using Index Notation
URLS[URLs.length] = newURL; //IN-CLASS: in the case where length of array can't be counted
console.log(URLs);
// years = years.concat(newYear); //Add to an Array By Forming a New Array Using concat()
years = years.concat([newYear]) //IN-CLASS: adding two type arrays by adding brackets, currently the variable newYear is an integer item
console.log(years);

// // Task 3
// // construct an Object out of our three Arrays
// // the result should look similar to this:
// var result = {
//   "Museum Name 1": {
//     URL: "www.museumwebsite.com",
//     year: 2019
//   }
// }

var museums = {};
for (var i = 0; i < names.length; i++) {
  var currentName = names[i];
  var currentURL = URLs[i];
  var currentYear = years[i];

  museums[currentName] = {};
  museums[currentName]["URL"] = currentURL;
  museums[currentName].year = currentYear;
}

console.log("museums", museums);

var museums2 = {};
names.forEach(function (n, i) {
  museums2[n] = {};

  var currentURL = URLs[i];
  var currentYear = years[i];

  museums2[n].URL = currentURL;
  museums2[n]["year"] = currentYear;
  //IN-CLASS: using a dot (no space in string) vs. brackets around quotation are two ways of creating these labels within the object
});

console.log("museums2", museums2);

// // Task
// // Write a function to add a new museum object, with properties URL and year, to an existing museums object. Call it on museums2
// function addAMuseum(museums, newName, newURL, newYear) {
//   var newMuseums = {
//     URL: newURL,
//     year: newYear,
//   };

//   museums[newName] = newMuseums;

//   return museums;
// }

// addAMuseum(museums2);

// console.log("museums2", museums2);

//IN-CLASS (below)
  function addAMuseum(museums, newName, newURL, newYear) {
    museums[newName] = {};
    museums[newName].URL = newURL; //first child of museum object
    museums[newName].year = newYear; //second child of museum object

    return museums;
  };
  
  //call function on museums2
  addAMuseum(museums2, "NGA", "nga.gov", 2014);

  console.log("museums2", museums2);
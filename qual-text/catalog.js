// // function getTheme(json) {
// //   // Select a <div> with an id of "app" where titles will be added
// //   let app = d3.select("#app3");

// //   // Filter and sort the JSON data based on "class" and "text"
// //   //   const data = Object.values(json).filter((item) => item.class === "c5 title");

// //   //   data.sort((a, b) => a.text.localeCompare(b.text));
// //   const data = json.filter((item) => item["@class"] === "c5 title");

// //   //   if (data.length > 0) {
// //   //     data.forEach((title) => {
// //   //       // Access the text property within the title object
// //   //       const themeText = title.text;
// //   //       console.log(themeText);
// //   //     });
// //   //   } else {
// //   //     console.log("Theme not found.");
// //   //   }

// //   //   // Define "cards" for each item
// //   //   let card = app
// //   //     .selectAll("div.card")
// //   //     .data(data)
// //   //     .join("div")
// //   //     .attr("class", "card");

// //   //   card
// //   //     .append("p")
// //   //     .attr("class", "theme")
// //   //     .text((d) => d.text);

// //   //   console.log(data);
// //   // }
// //   if (data.length > 0) {
// //     // Create an array of theme texts
// //     const themeTexts = data.map((item) => item["#text"]);

// //     // Define "cards" for each item
// //     let cards = app
// //       .selectAll("div.card")
// //       .data(themeTexts)
// //       .join("div")
// //       .attr("class", "card");

// //     cards
// //       .append("p")
// //       .attr("class", "theme")
// //       .text((d) => d);
// //   } else {
// //     console.log("Theme not found.");
// //   }
// // }
// // // Load JSON using d3.json
// // d3.json("data/catalog/list.json").then((json) => {
// //   // Execute our display titles function
// //   console.log(json);
// //   getTheme(json);
// // });

// // // function getTheme(json) {
// // //   // Select a <div> with an id of "app" where titles will be added
// // //   let app = d3.select("#app3");

// // //   // Find the p array with a class of "c5 title"
// // //   const pArray = json.body.p;

// // //   if (pArray) {
// // //     const data = pArray.filter((item) => item["@class"] === "c5 title");

// // //     if (data.length > 0) {
// // //       // Create an array of theme texts
// // //       const themeTexts = data.map((item) => item["#text"]);

// // //       // Define "cards" for each item
// // //       let cards = app
// // //         .selectAll("div.card")
// // //         .data(themeTexts)
// // //         .join("div")
// // //         .attr("class", "card");

// // //       cards
// // //         .append("p")
// // //         .attr("class", "theme")
// // //         .text((d) => d);
// // //     } else {
// // //       console.log("Theme not found.");
// // //     }
// // //   } else {
// // //     console.log("p array not found.");
// // //   }
// // // }

// // // // Load JSON using d3.json
// // // d3.json("data/catalog/list.json").then((json) => {
// // //   // Execute our display titles function
// // //   getTheme(json);
// // // });
// function getTheme(text) {
//   // Parse the text data into an object if it's in JSON format
//   try {
//     const json = JSON.parse(text);

//     // Check if the JSON structure is as expected
//     if (json && json.body && json.body.p) {
//       const pArray = json.body.p;
//       const data = pArray.filter((item) => item["@class"] === "c5 title");

//       if (data.length > 0) {
//         // Create an array of theme texts
//         const themeTexts = data.map((item) => item["#text"]);

//         // Select a <div> with an id of "app" where titles will be added
//         let app = d3.select("#app3");

//         // Define "cards" for each item
//         let cards = app
//           .selectAll("div.card")
//           .data(themeTexts)
//           .join("div")
//           .attr("class", "card");

//         cards
//           .append("p")
//           .attr("class", "theme")
//           .text((d) => d);
//       } else {
//         console.log("Theme not found.");
//       }
//     } else {
//       console.log("JSON structure does not match the expected format.");
//     }
//   } catch (error) {
//     console.error("Error parsing JSON:", error);
//   }
// }

// // Load text data from a file
// d3.text("data/catalog/list.txt").then((text) => {
//   // Execute our function to process the text data
//   getTheme(text);
// });
// // const cheerio = require("cheerio");
// import { load } from "cheerio";

// function getTheme(html) {
//   // Load the HTML content into Cheerio
//   const $ = load(html);

//   // Find elements based on their attributes
//   const data = $('p[@class="c5 title"]');

//   if (data.length > 0) {
//     // Create an array of theme texts
//     const themeTexts = data.map((index, element) => $(element).text()).get();

//     // Select a <div> with an id of "app" where titles will be added
//     let app = d3.select("#app3");

//     // Define "cards" for each item
//     let cards = app
//       .selectAll("div.card")
//       .data(themeTexts)
//       .join("div")
//       .attr("class", "card");

//     cards
//       .append("p")
//       .attr("class", "theme")
//       .text((d) => d);
//   } else {
//     console.log("Theme not found.");
//   }
// }

// // Load HTML content from a file (or an HTTP request)
// d3.text("data/catalog/list.html").then((html) => {
//   // Execute our function to process the HTML content
//   getTheme(html);
// });

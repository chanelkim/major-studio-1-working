// function evaluation for the digitized microfiche catalog "The Consolidated Catalog to The Index of American Design" Edited by Sandra Shaffer Tinkham

// npm install axios
// npm install cheerio

fetch("data/catalog/list.txt")
  .then((response) => response.text())
  .then((data) => {
    // Now you can work with the file content in the "data" variable
    console.log(data);
    data.children().each(function (i, elem) {
      if ($(elem).attr("class") == "c5 title") {
        let title = $(elem).html(); // table row data
        let result = getCategory(title); // RUN FUNCTION
        console.log(result);
      }
    });
  })
  .catch((error) => {
    console.error("Error loading the file:", error);
  });

// const fs = require("fs");
// const cheerio = require("cheerio");
// import * as cheerio from "cheerio";

// // RAW DATA
// let rawFile = "list";
// let content = readFileSync("data/catalog/" + rawFile + ".txt");

// let content = readFileSync("data/catalog/list.txt");

// load `content` into a cheerio object
// let $ = load(data); // $ is the object based on the rawFile

// // --------------------- RAW ROWS ---------------------
let body = $("body");
// .eq(2).find("tbody");
let index = [];
let themes = [];

body.children().each(function (i, elem) {
  if ($(elem).attr("class") == "c5 title") {
    let title = $(elem).html(); // table row data
    let result = getCategory(title); // RUN FUNCTION
    console.log(result);

    // console.log(result.Info.address);
    // meetings.push(result.Info.address);
  }
});

// COMMENTED OUT FOR TESTING
// fs.writeFileSync("data/catalog-parsed.json", JSON.stringify(themes));

// --------------------- MAIN FUNCTION ---------------------
function getCategory(data) {
  let htmlSplits = html.split("c5 title");
  return htmlSplits;
}

// let category = {
//   type: [],
//   itemType: [],
// };

// const splitCat = rawCatSplitter(data);

// const mainCat = category.split("</p>");

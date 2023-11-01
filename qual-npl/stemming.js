const natural = require("natural");
const fs = require("fs");

// Load the JSON files
const wordsData = JSON.parse(
  fs.readFileSync("data/textLinks-results-v2.json", "utf8")
);
const titlesData = JSON.parse(fs.readFileSync("data/IoAD.json", "utf8"));

// Extract the stemmed words from the 'words.json' file
const stemmedWords = wordsData.map((item) => item["Word"].toLowerCase()); // Ensure lowercase for case-insensitive matching

// Match stemmed words with titles
const matchedTitles = titlesData.filter((titleItem) => {
  // Split the title into words
  const titleWords = titleItem["title"].toLowerCase().split(" "); // Ensure lowercase for case-insensitive matching

  // Check if any of the title words are in the stemmed words
  return titleWords.some((word) => stemmedWords.includes(word));
});

// Output the matched titles
console.log(matchedTitles);

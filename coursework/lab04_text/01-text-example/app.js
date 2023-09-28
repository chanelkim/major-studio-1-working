/*
String documentation:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
*/

function getInput() {
  let input = document.getElementById("myInput").value; //IN-CLASS: can ask a form element's content, "innerElement" is any DOM element; ".value" is an attribute of the input element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
  processText(input)
}

function processText(input) {

  // output just the text:
  addLetterWithSize("The text is: " + input);

  // Task: What's the text length?

  // Task: What's the fifth character in the text?

  // Task: Output the last 10 characters of the text

  // Task: What's the second word in the text?

  // where in the text does the word "rainbows" appear?

  // replace the word "love" with another verb

  // how many times does the word "love" appear

  // count how many times each letter appears within the text and create a visualization of it

}

// two functions that actually write to the DOM. We're using D3 here but could also use vanilla javascript

function addText(text){
 d3.select('#app')
 .append('p')
 .text(text);
}

function addLetterWithSize(letter, textSize){
  d3.select('#concretePoetry')
  .append('span') //IN-CLASS: span will output inline, paragraphs and divs will output a new line
  .text(letter)
  .style("font-size", letter.length*2+"px"); //IN-CLASS: the size of the text is linked to the character count
}



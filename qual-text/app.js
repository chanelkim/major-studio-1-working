// "d3" is globally available because we have the d3 code in our index.html file

function displayTitle(json) {
  // Select a <div> with an id of "app" where titles will be added
  let app = d3.select('#app').text('');

  // Sort the JSON data by title and objectid
  let data = json.sort((a, b) => {
      if (a.title === b.title) {
          // If titles are equal, sort by objectid
          return a.objectid > b.objectid ? 1 : -1;
      } else {
          // Sort by title
          return a.title > b.title ? 1 : -1;
      }
  });

  // Define "cards" for each item
  let card = app.selectAll('div.card')
    .data(data)
    .join('div')
    .attr('class', 'card');

    card.append('p')
    .attr('class', 'partsOfSpeech')
    .text(d => {
      const spans = processRita(d.title);
    })

    card.append('p')
    .attr('class', 'title')
    .html(d=> {
      const quoteResult = extractAndRemoveTextInQuotes(d.title);
      const quoteExtractedText = quoteResult.extractedText;
      const quoteModifiedTitle = quoteResult.modifiedTitle;
  
      const parenResult = extractAndRemoveTextInParentheses(quoteModifiedTitle);
      const parenExtractedText = parenResult.extractedText;
      const parenModifiedTitle = parenResult.modifiedTitle;
  
      // Check if the title has been modified
      const isModified = quoteModifiedTitle !== d.title || parenModifiedTitle !== d.title;

      if (isModified) {
        // If modified, display the modified title and extracted text
        const extractedTextHtmlQuote = quoteExtractedText ? `<br>In Quotes: ${quoteExtractedText}` : '';
        const extractedTextHtmlParens = parenExtractedText ? `<br>Description: ${parenExtractedText}` : '';
        return `${extractedTextHtmlQuote}${extractedTextHtmlParens}<br>Modified Title: ${parenModifiedTitle}`;
      } else {
        // If not modified, display the original title
        return `<br>Title: ${d.title}`;
      }
    });
}

function extractAndRemoveTextInQuotes(title) {
  const regex = /"([^"]+)"(?=\s|$)/g;
  const matches = [];
  let match;

  while ((match = regex.exec(title)) !== null) {
    matches.push(match[0]);
  }

  // Join the extracted text into a single string with spaces as separators
  const extractedText = matches.join(' ');

  // Use a single replace operation to remove the extracted text from the title
  const modifiedTitle = title.replace(regex, '').trim();

  // Return both the extracted text and the modified title
  return { extractedText, modifiedTitle };
}

function extractAndRemoveTextInParentheses(title) {
  const regex = /\(([^)]+)\)/g;
  const matches = [];
  let match;

  while ((match = regex.exec(title)) !== null) {
    matches.push(match[0]);
  }

  // Join the extracted text into a single string with spaces as separators
  const extractedText = matches.join(' ');

  // Use a single replace operation to remove the extracted text from the title
  const modifiedTitle = title.replace(regex, '').trim();

  // Return both the extracted text and the modified title
  return { extractedText, modifiedTitle };
}

function processRita(title) {
  // Create a Rita string from the title
  let rs = new RiString(title);
  // console.log(rs)

  // Break the phrase into words
  let words = rs.words();
  // Get part-of-speech tags
  let pos = rs.pos();
  // console.log(pos)
  let app = d3.select('#app2');
  let spans = [];
  let allWords = [];

    // let's go through all words
    words.forEach((word, i) => {
      allWords.push(word)
      // let's make one span per word
      let span = app.append('span')
        .text(word)  

      //if the word is a noun, let's attach the class "noun"  
      if (pos[i]=="nn" || pos[i]=="nns" || pos[i]=="nnp" || pos[i]=="nnps") {
        span.attr('class', 'noun')
        // nouns.push(word)
        
      //if the word is a verb, attach the class "verb"  
        } else if (pos[i]=="vb" || pos[i]=="vbd" || pos[i]=="vbg" || pos[i]=="vbn" || pos[i]=="vbp" || pos[i]=="vbz") {
        span.attr('class', 'verb')
      //if the word is an adjective, attach the class "adjective"
        } else if (pos[i]=="jj" || pos[i]=="jjr" || pos[i]=="jjs") {
        span.attr('class', 'adjective')
        } 
        else if (pos[i]=="rb" || pos[i]== "rbr" || pos[i]=="rbs" || pos[i]=="wrb") {
        span.attr('class', 'adverb')
        } 
        else if (pos[i]=="\"" || pos[i]== "(" || pos[i]== ")" || pos[i]== "," || pos[i]== "-" || pos[i]== "&" || pos[i]== "[" || pos[i]== "]" || pos[i]== "cd" || pos[i]== "ex" || pos[i]== "fw" || pos[i]== "ls" || pos[i]== "md" || pos[i]== "pdt" || pos[i]== "pos" || pos[i]== "prp" || pos[i]== "prp$" || pos[i]== "rp" || pos[i]== "to" || pos[i]== "uh" || pos[i]== "wdt" || pos[i]== "wp" || pos[i]== "wp$" || pos[i]== "dt" || pos[i]=="in" || pos[i]=="cc" || pos[i]=="sym") {
          span.attr('class', 'na')
        }

      // by placing each word into an array separately we have lost the white spaces, let's add them back
      if(!RiTa.isPunctuation(pos[i+1])){
        app.append('span')
        .text(" ")  
      }
      spans.push(span);
    })

    // Append spans to the 'app' element
    spans.forEach(span => {
      app.node().appendChild(span.node());
    });

    let nouns = allWords.filter((word, i) => pos[i] === "nn" || pos[i] === "nns" || pos[i] === "nnp" || pos[i] === "nnps");
    return {spans, nouns}

}

// Create an array to store the objects for each title
let processedTitles = [];
// console.log(processedTitles)

// Load JSON using d3.json
d3.json('data/IoAD_artists_imgs.json')
  .then(json => {
    // Execute our display titles function
    displayTitle(json);
    json.forEach(item => {
      let result = processRita(item.title);
      processedTitles.push(result);
    });
  })
  .then(() => {
    let allNouns = [];

    // Iterate through the processed titles and collect nouns
    processedTitles.forEach(titleObj => {
      allNouns = allNouns.concat(titleObj.nouns);
    });
  
    // Now 'allNouns' contains all the nouns from all processed titles
  
    // You can count the occurrences of each noun using a JavaScript object
    let nounCounts = {};
    allNouns.forEach(noun => {
      if (nounCounts[noun]) {
        nounCounts[noun] += 1;
      } else {
        nounCounts[noun] = 1;
      }
    });

    // Convert object to an array of key-value pairs
    const nounArray = Object.entries(nounCounts);

    // Sort the array by count in descending order
    nounArray.sort((a, b) => b[1] - a[1]);
    // nounArray.sort((a, b) => parseInt(b[1], 10) - parseInt(a[1], 10));
    console.log(nounArray)
    console.log(nounArray.length)
  });
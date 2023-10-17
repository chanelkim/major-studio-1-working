// "d3" is globally available
// because we have the d3 code
// in our index.html file

// load JSON using d3.json
d3.json('data/IoAD_artists_imgs.json')
  .then( json => {
      // execute our 
      // display images function
      displayImages(json);
  }); 

// this function creates all
// of our DOM elements
function displayImages(json){
    // select a <div> with an id of "app"
    // this is where we want all of our
    // images to be added
    let app  = d3.select('#app').text('');

    // take our JSON and sort it
    // objectid descending
    // let data = json.sort((a,b) => (b.objectid > a.objectid) ? 1 : -1);
        // objectid ascending, then attribution ascending
        let data = json.sort((a, b) => {
            if (a.objectid === b.objectid) {
                // If objectids are equal, sort by attribution
                return a.attribution > b.attribution ? 1 : -1;
            } else {
                // Sort by objectid
                return a.objectid > b.objectid ? 1 : -1;
            }
        });
        
    // date descending
    // let data = json.sort((a,b) => (b.date > a.date) ? 1 : -1);
    // // date ascending
    // let data = json.sort((a,b) => (a.date > b.date) ? 1 : -1);

    // define "cards" for each item
    let card = app.selectAll('div.card')
                .data(data)
                .join('div')
                .attr('class', 'card');

    // create a div with a class of "image"
    // and populate it with an <img/> tag
    // that contains our filepath
    card.append('div')
        .attr('class', 'image')
        .append('img')
        .attr('src', d => {
            // all our images are in the "images"
            // folder which we will need to 
            // add to our filename first
            // return './images/' + d.filename
            // Use the imageURL property from JSON data
            return d.imagematch;
        });

    // create a paragraph that will
    // hold the object date
    card.append('p')
        .attr('class', 'object-id')
        .text(d=>d.objectid);

    // create a heading tag
    // that will be the object title
    card.append('h3')
        .attr('class', 'title')
        .text(d=>d.title);

    // create a heading tag
    // that will be the attribution
    card.append('h2')
        .attr('class', 'attribution')
        .text(d=>d.attribution);
};
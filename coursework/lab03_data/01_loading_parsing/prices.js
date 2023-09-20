// helper function to parse date information
let parseDate = d3.timeParse("%m/%d/%Y");

// let's load our data
d3.csv('data/prices.csv').then((data) => {
    //format our data (make data a date, make price a number)
    //IN-CLASS: **ASSIGNING**
    data.forEach(function(n){
        n.month = parseDate(n.month); // what does this do? 
        n.price = Number(n.price.trim().slice(1)); // what does this do? 
        //IN-CLASS: take off the dollar sign
    })

    // select the html body and add a div with one price
    //IN-CLASS: **READING**
    d3.select('body')                
        .append('div')
        .html("The first price is: " + data[0].price);    

    //write out the entire data set in html 
    //IN-CLASS: **WRITING**
    d3.select('#data')
        .selectAll('p')
        .data(data)
        .join('p') //IN-CLASS: joined as a paragraph, 
        .html(d => "$"+d.price+ " on " + d.month);
}); 
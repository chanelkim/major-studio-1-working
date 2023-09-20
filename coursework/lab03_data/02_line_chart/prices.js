
// helper function to parse date information
let parseDate = d3.timeParse("%m/%d/%Y");

// let's load our data
d3.csv('data/prices.csv').then((data) => {

    //format our data (make data a date, make price a number) 
    data.forEach((n) => {
        n.month = parseDate(n.month);
        n.price = Number(n.price.trim().slice(1));
    })

    // defining our canvas
    let height = 300;
    let width = 500;

    // defining margins
    //IN-CLASS: JSON formatted object
    let margin = {left:50,right:50,top:40,bottom:0};

    // defining our max and mins
    //IN-CLASS: getting the min and max allows for first step in analysis
    let max = d3.max(data,(d) => { return d.price; }); //IN-CLASS: giving maximum within array
    let minDate = d3.min(data,(d) => { return d.month; }); //IN-CLASS: d3 earliest date
    let maxDate = d3.max(data,(d) => { return d.month; }); //IN-CLASS: d3 most recent date

    // defining our scales
    let y = d3.scaleLinear() //IN-CLASS: most legible scale, especially for price
                .domain([0, max]) //IN-CLASS: actual range
                .range([height,0]); //IN-CLASS: displayed range, the height is flipped because of the origin

    let x = d3.scaleTime()
                .domain([minDate, maxDate])
                .range([0, width]); //IN-CLASS: 0 to width means left-to-right

    // defining our axes
    let yAxis = d3.axisLeft(y);
    let xAxis = d3.axisBottom(x);

    // let's create an svg file and add it to the body
    let svg = d3.select("body").append("svg").attr("height","100%").attr("width","100%");


    // a graphic that sits within the svg and will hold our line chart
    let chartGroup = svg.append("g")
                .attr("transform","translate("+margin.left+","+margin.top+")"); //IN-CLASS: transform is CSS and is a cleaner way of moving the chart

    // defining our line function
    let line = d3.line().x((d) => { return x(d.month); }).y((d) => { return y(d.price); }); //IN-CLASS: d3 asking how do you want the horizontal and linear lines to be drawn

    // adding the line to the graphic                
    chartGroup
    .append("path")
    .attr("d",line(data));

    // adding the x axis to the graphic    
    chartGroup
    .append("g")
    .attr("class","x axis")
    .attr("transform","translate(0,"+height+")")
    .call(xAxis);

    // adding the y axis to the graphic
    chartGroup
    .append("g")
    .attr("class","y axis")
    .call(yAxis);
  });
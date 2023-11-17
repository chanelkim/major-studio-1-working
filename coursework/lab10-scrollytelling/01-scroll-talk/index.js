const margin = 20;

d3.json("./jabberwocky.json").then((data) => {
  const section = d3
    .select(".sections")
    .selectAll(".section")
    .data(data)
    .join("div")
    .attr("class", (d, i) => "section section-" + i) //IN-CLASS: giving an element more than one class, first is "section" and the second is "section-iterator"; something shared, something unique, and another attribute to select; child (last one in the dom / assigned) will override parent; could use id instead of class but that would assume they are more unique
    .html((d) => d.join("<br>"));

  let sectionPositions = [];
  section.each(function () {
    const { top } = this.getBoundingClientRect(); //IN-CLASS: in order to read coordinates dynamically, today in this example we are y-axis focused, thinking about the scroll vertically; https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
    sectionPositions.push(top);
  });

  // https://vallandingham.me/scroller.html#detecting-the-active-section
  function position() {
    var pos = window.scrollY - 10; //IN-CLASS: scroll with offset of 10; https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY
    var sectionIndex = d3.bisect(sectionPositions, pos); //IN-CLASS: d3.bisect - returns the index value because we don't care about the pixel value, just want to know where we are
    sectionIndex = Math.min(section.size() - 1, sectionIndex); //IN-CLASS: ensures that we don't go out of bounds, we want to get the index that is the largest possible item

    if (state.currentIndex !== sectionIndex) {
      setState({
        currentIndex: sectionIndex,
      });
    } //IN-CLASS: checking which index we are in and re-writing to our currentIndex; state is a global variable (see below)
  }

  window.addEventListener("scroll", position); //IN-CLASS: callback that reports when there is a scroll, which uses the callback function "position"

  draw();
});

function setup() {
  const viz = d3.select(".viz");
  const svg = viz.append("svg").attr("height", 500).attr("width", 500);

  svg.append("g").attr("class", "bars");

  const xAxis = svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${margin})`);
  const yAxis = svg
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${margin}, 0)`);
}

let state = {
  currentIndex: 0,
};

function setState(nextState) {
  console.log(nextState);
  state = { ...state, ...nextState }; //IN-CLASS: spreaders, every time the state changes, the state has to be redrawn
  draw();
}

function draw() {
  const { currentIndex } = state;
  console.log("currentIndex", currentIndex);
  const section = d3
    .selectAll(".section")
    .classed("current", (_, i) => i === currentIndex); //IN-CLASS: all classes called section will get the arrays, getting a list back, we are looking at the iterator and seeing if it matches the iterator of the section we're in; given a new class is good for not only knowing where it is but also giving it a differentiating style

  const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const sectionText = section
    .filter((_, i) => i === currentIndex)
    .text()
    .toUpperCase();
  const data = alpha.map((letter) => ({
    letter,
    value: [...sectionText.matchAll(letter)].length,
  })); //IN-CLASS: a dictionary that matches the letters; https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll
  console.log(data);

  const svg = d3.select("svg");

  const xScale = d3
    .scaleLinear()
    .domain([0, 15])
    .range([margin, 500 - margin]);

  const yScale = d3
    .scaleBand()
    .paddingInner(0.1)
    .domain(alpha)
    .range([margin, 500 - margin]);

  //IN-CLASS: where the bars are being drawn, "transition()" is where we are seeing the animation
  svg
    .select(".bars")
    .selectAll("rect.bar")
    .data(data)
    .join("rect")
    .attr("class", "bar")
    .attr("x", xScale(0))
    .attr("y", (d) => yScale(d.letter))
    .attr("height", yScale.bandwidth())
    .transition()
    .attr("width", (d) => xScale(d.value) - margin);

  svg
    .select(".bars")
    .selectAll("text.bar")
    .data(data)
    .join("text")
    .attr("class", "bar")
    .attr("y", (d) => yScale(d.letter) + 12)
    .text((d) => d.value || "")
    .transition()
    .attr("x", (d) => xScale(d.value) - 5);

  svg.select(".x-axis").call(d3.axisTop(xScale));
  svg.select(".y-axis").call(d3.axisLeft(yScale));
}

setup();

//   Register to get your Mapbox access token https://docs.mapbox.com/help/glossary/access-token/
//   Code from https://docs.mapbox.com/help/tutorials/custom-markers-gl-js/

mapboxgl.accessToken =
  "pk.eyJ1IjoicmVhZHlsZXRzZ28iLCJhIjoiY2t0dTR2aGNjMXd3bDJubWgwcWwzcWJzMyJ9.4Qpfc2HBPT14KIrBhX0XGQ";

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v10",
  // center: [-96, 37.8],
  center: [-73.9911, 40.7359], //IN-CLASS: Union Square
  // zoom: 1,
  zoom: 7,
});

/*** load data ***/
async function loadData() {
  const airports = await d3.csv("data/airports.csv");

  // add markers to map
  airports.forEach(function (d) {
    // create a HTML element for each feature
    var el = document.createElement("div");
    el.className = "marker";

    // make a marker for each feature and add to the map
    new mapboxgl.Marker(el) //IN-CLASS: "mapbox" + "gl" (webgl), setting the marker at that element to create popup; offset allows showing label without hiding what we're looking at
      .setLngLat([d.longitude, d.latitude])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }) // add popups
          .setHTML("<h3>" + d.name + "</h3>")
      )
      .addTo(map);
  });
}

loadData();

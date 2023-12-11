d3.json("data/catalog_groups-1.json").then(function (data) {
  analyzeData(data);
});
d3.json("data/catalog_groups.json").then(function (data) {
  analyzeData(data);
});

function analyzeData(data) {
  console.log(data);
}

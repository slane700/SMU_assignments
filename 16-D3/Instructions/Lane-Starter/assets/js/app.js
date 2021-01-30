$(document).ready(function() {
    makePlot();
});

function makePlot() {
    d3.csv("assets/data/data.csv").then(function(census_data) {
        console.log(census_data);
    });
}

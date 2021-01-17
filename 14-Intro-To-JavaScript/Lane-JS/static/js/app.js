// from data.js
var tableData = data;
$(document).ready(function(){
    buildTable(); 

    //event listeners 
    $("#filter-btn").on("click", function(e) {
        e.preventDefault();
        buildTable();
    });
    $("#form").on("submit", function(e) {
        e.preventDefault();
        buildTable();
    });

});
function buildTable() {
    var dateFilter = $("#datetime").val(); //gets input value to filter
    var cityFilter = $("#city").val().toLowerCase();
    var stateFilter = $("#state").val().toLowerCase(); 
    var countryFilter = $("#country").val().toLowerCase(); 
    var shapeFilter = $("#shape").val().toLowerCase(); 


    //applying fliters
    var filteredData = tableData

    if (dateFilter !== ""){
        filteredData = filteredData.filter(row => row.datetime === dateFilter);
    }
    if (cityFilter !== ""){
        filteredData = filteredData.filter(row => row.city === cityFilter);
    }
    if (stateFilter !== ""){
        filteredData = filteredData.filter(row => row.state === stateFilter);
    }
    if (countryFilter !== ""){
        filteredData = filteredData.filter(row => row.country === countryFilter);
    }
    if (shapeFilter !== ""){
        filteredData = filteredData.filter(row => row.shape === shapeFilter);
    }
    if (filteredData.length === 0) {
        alert("Invalid Date Discovered!");
    }

    buildTableString(filteredData);
}

function buildTableString(data) {
    // JQUERY creates an HTML string
    var tbody = $("#ufo-table>tbody");
    //clear table
    tbody.empty();

    //append data
    data.forEach(function(row) {
        var newRow = "<tr>"
            // loop through each Object (dictionary)
        Object.entries(row).forEach(function([key, value]) {
            // set the cell data
            newRow += `<td>${value}</td>`
        });

        //append to table
        newRow += "</tr>";
        tbody.append(newRow);
    });
}

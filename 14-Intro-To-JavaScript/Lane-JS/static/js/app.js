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

    if (dateFilter === "") {
        buildTableString(tableData);
    } else {
        var filteredData = data.filter(row => row.datetime === dateFilter);
        if (filteredData.length === 0) {
            alert("Invalid Date Discovered!");
        }

        buildTableString(filteredData);
    }
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

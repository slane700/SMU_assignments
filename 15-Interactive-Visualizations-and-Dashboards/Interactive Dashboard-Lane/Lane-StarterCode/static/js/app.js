$(document).ready(function() {
    dropDown();  
    buildCharts();
    $("#selDataset").change(function() {
        getdemoInfo(); 
    });

});

function buildCharts(){
    d3.json("samples.json").then(sampledata => {
        console.log(sampledata)
        var ids = sampledata.samples[0].otu_ids.slice(0,10);
        console.log(ids)
        var sampleValues =  sampledata.samples[0].sample_values.slice(0,10);
        console.log(sampleValues)
        var otu_labels =  sampledata.samples[0].otu_labels.slice(0,10);
        console.log(otu_labels)

        var OTU_id = ids.map(d => "OTU " + d);
        console.log(`OTU IDS: ${OTU_id}`)
    //bar chart documentation 
    var data = [{
        type: 'bar',
        x: sampleValues,
        y: OTU_id,
        orientation: 'h'
        }];
            
    Plotly.newPlot('bar', data);

//bubble chart documenttaion 
    var trace1 = {
        x: OTU_id,
        y: sampleValues,
        text: otu_labels,
        mode: 'markers',
        marker: {
            color: OTU_id,
            size: sampleValues
        }
    };
    
    var data = [trace1];
    
    var layout = {
        title: 'Bubble Chart Hover Text',
        showlegend: false,
        height: 600,
        width: 600
    };
    
    Plotly.newPlot('bubble', data, layout);
}); 
//guage chart documentations 
    var data = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: 270,
            title: { text: "Speed" },
            type: "indicator",
            mode: "gauge+number"
        }
];

    var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
    Plotly.newPlot('guafe', data, layout);
}
    
function dropDown(){
    var dropdown = d3.select("#selDataset"); 

    d3.json("samples.json").then((data)=> {
        // get the id data to the dropdown menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });
    })}

// function getdemoInfo() {
//     d3.json("samples.json").then((data)=> {
//     var metadata= data.metadata;
//     console.log(metadata)
   
    
//     var select = $("#sample-metadata");
//     select.html(""); 
//     Object.entries(??).forEach(([key,value]) =>{
//         select
//           .append('p').text(`${key} : ${value}`)
//           .append('hr')


//     }); 
// })
// }
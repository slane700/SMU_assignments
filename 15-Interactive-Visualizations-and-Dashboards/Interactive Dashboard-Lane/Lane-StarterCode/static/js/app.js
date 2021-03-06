var allData = []; 

$(document).ready(function() {
    init(); 

    $('#selDataset').change(function() {
        doWork(); 
    });

});

function init(){ 
    d3.json("samples.json").then((data) => {
        allData = data;
        dropDown(data); 
        doWork();
    }); 
}
function doWork (){
    var sample = parseInt($("#selDataset").val()); 
    var meta = allData.metadata.filter( x=> x.id === sample)[0]; 
    //var sampleData = allData.samples.filter(x => x.id == sample)[0]; 
    var sampleData = allData.samples.filter(x => x.id == sample)[0];
   
    demographics(meta); 
    buildCharts(sampleData, meta); 
}
function buildCharts(sampleData, meta){ 
    barGraph(sampleData); 
    bubbleGraph(sampleData); 
    guage(meta); 
    console.log(sampleData); 

}

function barGraph(sampleData){
   var OTU_id = sampleData.otu_ids.slice(0, 10).reverse().map(x=> `OTU ID: ${x}`); 

    //bar chart documentation 
    var trace = {
        x: sampleData.sample_values.slice(0, 10).reverse(),
        y: OTU_id,
        text: sampleData.otu_labels.slice(0, 10).reverse(),
        type: 'bar',
        orientation: 'h',
        marker: {color:'rgba(222,45,38,0.8)'}
        };
    var layout = {
        title: "Top 10 Bacteria Present in Belly Button", 
        xaxis: {
            title: "Amount of Bacteria (OTU, operational taxonomic unit)",
            tickangle: -45,
            titlefont: {
                size: 16,
                color: 'rgb(107, 107, 107)'
              },
          },
        yaxis: {
            title: "Bacteria OTU ID", 
            titlefont: {
                size: 16,
                color: 'rgb(107, 107, 107)'
              },
              tickfont: {
                size: 8,
                color: 'rgb(107, 107, 107)'
        }}
    }

    var traces = [trace]; 

    Plotly.newPlot('bar', traces, layout);

}

function bubbleGraph(sampleData){
//bubble chart documenttaion 
    var trace = {
        x: sampleData.otu_ids,
        y:  sampleData.sample_values,
        mode: 'markers',
        marker: {
            size: sampleData.sample_values,
            color: sampleData.otu_ids,
        },
        text: sampleData.otu_labels
    };
    var traces = [trace];
    var layout = {
        title: 'Amount of Each Bacteria Present',
        xaxis: {title: "Bacteria OTU ID",
        titlefont: {
            size: 14,
            color: 'rgb(107, 107, 107)'
          }},
        yaxis: {title: "Amount of Bacteria (OTU, operational taxonomic unit)",
            titlefont: {
            size: 14,
            color: 'rgb(107, 107, 107)',
        },
            tickfont: {
                size: 10,
        }}
    }

    Plotly.newPlot('bubble', traces, layout);
}

function guage(meta){ 
    //guage chart documentations 
    var trace = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: meta.wfreq,
            title: { text: "Number of Times Belly Button Washed per Week", font: { size: 14 }}, 
            type: "indicator",
            gauge: {
                bar: { color:'rgba(222,45,38,0.8)'},
                axis: {range: [null, 10]}, 
                steps: [
                    {range: [0,7], color: "white"},
                    {range: [7,10], color: "grey"}]

            }, 
            mode: "gauge+number"
        }
    ];
    var layout = {};
    Plotly.newPlot('gauge', trace, layout);
}

    
function dropDown(data){
    var dropdown = d3.select("#selDataset"); 
    allData.names.forEach(function(name) {
        dropdown.append("option").text(name).property("value");
        });
}

function demographics(meta){ 
    $("#sample-metadata").empty(); 

    Object.entries(meta).forEach(function(keyValue, index){
        var entry = `<span><b>${keyValue[0]}:</b> ${keyValue[1]}</span><br>`;
        $("#sample-metadata").append(entry); 
    })
}
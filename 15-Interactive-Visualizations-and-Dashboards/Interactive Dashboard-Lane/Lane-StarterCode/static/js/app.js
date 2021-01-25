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
        orientation: 'h'
        };
    var layout = {
        title: "Top 10 Bacteria Present in Belly Button", 
        xaxis: {title: "Amount of Bacteria"}, 
        yaxis: {title: "Bacteria ID"}
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
        title: 'Amount of Bacteria',
        xaxis: {title: "Amount of Bacteria"}, 
        yaxis: {title: "Bacteria ID"}
    }

    Plotly.newPlot('bubble', traces, layout);
}

function guage(meta){ 
    //guage chart documentations 
    var trace = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: meta.wfreq,
            title: { text: "Belly Button Washing Frequency" },
            type: "indicator",
            guage: {
                axis: {range: [null, 10]}, 
                steps: [
                    {range: [0,7], color: "light-pink"},
                    {range: [7,10], color: "pink"}
                ], 
                threshold: {
                    line: {color: "red", width: 4}, 
                    thickness: 0.75, 
                    value: 2
                }

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
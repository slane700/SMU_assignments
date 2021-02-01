$(document).ready(function() {
    makeGraph();

    $(window).resize(function() {
        makeGraph();
    });

});

function makeGraph() {
    d3.csv("assets/data/data.csv").then(function(censusData) {
        console.log(censusData);

        $("#scatter").empty(); 

        var svgWidth = window.innerWidth; 
        var svgHeight = 500; 

        var margin = { 
            top: 20,
            right: 40, 
            bottom: 60, 
            left: 50
        }; 

        var chartWidth = svgWidth - margin.left - margin.right; 
        var chartHeight = svgHeight - margin.top - margin.bottom; 

        var svg = d3.select("#scatter")
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .classed("chart", true); 

        var chartGroup = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`); 


         censusData.forEach(function(row) {
            row.poverty = +row.poverty; 
            row.healthcare = +row.healthcare; 
        }); 
        var xScale = d3.scaleLinear()
            .domain(d3.extent(censusData, d => d.poverty))
            .range([0, chartWidth]); 
        
        var  yScale = d3.scaleLinear()
            .domain(d3.extent(censusData, d => d.healthcare))
            .range([chartHeight, 0]); 
        
        var leftAxis = d3.axisLeft(yScale); 
        var bottomAxis = d3.axisBottom(xScale); 

        chartGroup.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(bottomAxis)

        chartGroup.append("g")
            .call(leftAxis); 

        var textGroup = chartGroup.append("g")
            .selectAll("text")
            .data(censusData)
            .enter()
            .append("text")
            .text(d => d.abbr)
            .attr("alignment-baseline", "central")
            .attr("font-size", 12)
            .classed("stateText", true); 
        
        var circlesGroup = chartGroup.append("g")
            .selectAll("circle")
            .data(censusData)
            .enter()
            .append("circle")
            .attr("stroke-width", "1")
            .classed("stateCircle", true); 
        
        chartGroup.selectAll("circle")
            .transition()
            .duration(5000)
            .attr("cx", d => xScale(d.poverty))
            .attr("cy", d => yScale(d.healthcare))
            .attr("r", "15")
            .delay(function(d,i){return i * 100}); 

        chartGroup.selectAll(".stateText")
            .transition()
            .duration(5000)
            .attr("x", d => xScale(d.poverty))
            .attr("y", d => yScale(d.healthcare))
            .delay(function(d,i){return i * 100}); 
        
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 0)
            .attr("x", 0 - (chartHeight / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Lacks Healthcare (%)"); 
        
        chartGroup.append("text")
            .attr("transform" ,`translate(${chartWidth /2}, ${chartHeight + margin.top + 30 })`)
            .attr("class", "axisText")
            .text("Poverty (%)")
        
            var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([180, -60])
            .html(function(d) {
                return (`${d.state}<br>Poverty: ${d.poverty}%><br>Lacks Healthcare: ${d.healthcare}%`);
            });

        // Step 2: Create the tooltip in chartGroup.
        circlesGroup.call(toolTip);

        // Step 3: Create "mouseover" event listener to display tooltip
        circlesGroup.on("mouseover", function(event, d) {
                toolTip.show(d, this);

                //make bubbles big
                d3.select(this)
                    .transition()
                    .duration(1000)
                    .attr("r", 100);
            })
            // Step 4: Create "mouseout" event listener to hide tooltip
            .on("mouseout", function(event, d) {
                toolTip.hide(d);

                d3.select(this)
                    .transition()
                    .duration(1000)
                    .attr("r", 15);
            });

    }).catch(function(error) {
        console.log(error);



    });
}

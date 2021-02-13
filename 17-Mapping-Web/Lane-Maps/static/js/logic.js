$(document).ready(function(){
    makeMap(); 

    $("timeFrame").change(function(){
        makeMap(); 
    });

});

function makeMap() {
    var timeFrame_text = $("timeFrame option:selected").text(); 
    $("mapTitle").text(`Earthquakes Recorded during the ${timeFrame_text}`); 

    var timeFrame = $("#timeFrame").val(); 

    var queryURL = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${timeFrame}.geojson`

    $.ajax({
        type: "GET",
        url: queryURL,
        success: function(earthquake_data) {
            // make second call
            // $.ajax({
            //     type: "GET",
            //     url: "/static/data/PB2002_boundaries.json",
            //     success: function(tectonic) {
            //         //BUILD WITH BOTH DATASETS
            //         buildmap(earthquake_data, tectonic);
            //     },
            //     error: function(XMLHttpRequest, textStatus, errorThrown) {
            //         alert("Status: " + textStatus);
            //         alert("Error: " + errorThrown);
            //     }
            // });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("Status: " + textStatus);
            alert("Error: " + errorThrown);
        }
    });
}

function buildmap(earthquake_data, tectonic){
    $("#mapcontainer").empty();
    $("#mapcontainer").append(`<div id="mapid"></div>`);

    var darkMode = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/dark-v10",
        accessToken: API_KEY
    });

    var lightMode = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/light-v10",
        accessToken: API_KEY
    });

    var myMap = L.map("mapid", {
        center: [33.0, -96.0],
        zoom: 4,
        layers: [lightMode, darkMode]
    });

    var earthquakes = []; 
    var circle_list = []; 

    earthquake_data.features.forEach(function(earthquake){
        var marker = L.geoJSON(earthquake, {
            onEachFeature: onEachFeature
        }); 
        earthquakes.push(marker); 

        var circle = L.geoJSON(earthquake, {
            pointtolayer: function(feature, latlng) {
                var geoJSONmarkerOptions = createmarkerOptions(feature); 
                return L.circlemarker(latlng,geoJSONmarkerOptions); 
            }, 
            onEachFeature: onEachFeature
        }); 

    }); 

    var tectonicPlates = L.geoJSON(tectonic, {
        color: "Red", 
        weight: 2
    }); 

    var markerGroup = L.layerGroup(earthquakes)
    var markerGroup2 = L.layerGroup(circle_list)
    var markerGroup3 = L.layerGroup([tectonicPlates])

    var baseMaps = {
        "Light Mode": lightMode, 
        "Dark Mode" : darkMode 
    }; 

    var overlayMaps = {
         "Markers": markerGroup, 
        "Circles": markerGroup2, 
        "Tectonic Plates" : markerGroup3
    }; 

    L.control.layers(baseMaps, overlayMaps).addTo(myMap); 

    markerGroup3.addTo(myMap); 
    markerGroup3.addTo(myMap); 

    var legend = L.control({position: "topright"}); 
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"); 

        var legendinfo = `<h4 style = "margin-bottom:10px"> Earthquake Depth </h4>
        <div>
        <div style = "background:#98ee00;height:10px;width:10px;display:inline-block"> </div>
        </div> 
        <div>
        <div style = "background:#d4ee00;height:10px;width:10px;display:inline-block"></div> 
        <div style = "display:inline-block">10 - 30 Miles</div>
        </div>
        <div>
        <div style = "background:#eecc00;height:10px;width:10px;display:inline-block"></div>
        <div style = "display:inline-block">30 - 50 Miles</div>
        </div>
        <div>
        <div style = "background:#ee9c00;height:10px;width:10px;display:inline-block"></div> 
        <div style = "display:inline-block">50 - 70 Miles</div>
        </div>
        <div>
        <div style = "background:#ea822c;height:10px;width:10px;display:inline-block"></div>
        <div style = "display:inline-block">70 - 90 Miles</div>
        </div> 
        <div>
        <div style = "background:#ea2c2c;height:10px;width:10px;display:inline-block"></div>
        <div style = "display:inline-block">Greater than 90 Miles</div>
        </div>`;

        div.innerHTML = legendinfo; 
        return(div)
    }

    legend.addTo(myMap); 
}

function createMarkerOptions(feature) {
    var depth = feature.geometry.coordinates[2];
    var depthcolor = "";
    if (depth > 90) {
        depthcolor = "#ea2c2c";
    } else if (depth > 70) {
        depthcolor = "#ea822c";
    } else if (depth > 50) {
        depthcolor = "#ee9c00";
    } else if (depth > 30) {
        depthColor = "#eecc00";
    } else if (depth > 10) {
        depthcolor = "#d4ee00";
    } else {
        depthcolor = "#98ee00";
    }


    var geojsonMarkerOptions = {
        radius: (feature.properties.mag * 5) + 1,
        fillColor: depthColor,
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    return (geojsonMarkerOptions)
}

// called in the create circles
function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.place) {
        layer.bindPopup(feature.properties.title);
    }
}

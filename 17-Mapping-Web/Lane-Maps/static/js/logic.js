$(document).ready(function() {
    makeMap();
});

function makeMap() {
    // data
    // Store our API endpoint as queryUrl
    // var queryUrl = "http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
    //     "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

    var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

    // Perform a GET request to the query URL
    $.ajax({
        type: "GET",
        url: queryUrl,
        success: function(data) {
            console.log(data.features);

            buildMap(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("Status: " + textStatus);
            alert("Error: " + errorThrown);
        }
    });
}

function buildMap(data) {
    var streets = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

    var light_mode = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/light-v10",
        accessToken: API_KEY
    });

    var myMap = L.map("map", {
        center: [37.0902, -95.7129],
        zoom: 5,
        layers: [streets, light_mode]
    });

    var earthquakes = [];
    var circle_list = [];
    data.features.forEach(function(earthquake) {
        var marker = L.geoJSON(earthquake, {
            onEachFeature: onEachFeature
        });
        earthquakes.push(marker);


        var circle = L.geoJSON(earthquake, {
            pointToLayer: function(feature, latlng) {
                var geojsonMarkerOptions = makeMarkerOptions(feature)
                return L.circleMarker(latlng, geojsonMarkerOptions);
            },
            onEachFeature: onEachFeature
        });
        circle_list.push(circle);
    });

    var marker_group = L.layerGroup(earthquakes);
    var marker_group2 = L.layerGroup(circle_list);

 // Create Layer Legend
    var baseMaps = {
        "Light Mode": light_mode,
        "Streets Mode": streets
    };

    var overlayMaps = {
        "Markers": marker_group,
        "Circles": marker_group2
    };

    // Slap Layer Legend onto the map
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);


    var legend = L.control({ position: "topright"});
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");

        // create legend as raw html
        var legendInfo = `<h5> Earthquake Depth</h4>
        <div>
            <div style ="background:#4169E1;height:10px; width:10px;display:inline-block"></div>
            <div style= display:inline-block>Less than 10</div>
        </div>
        <div>
            <div style ="background:#0000CD;height:10px; width:10px;display:inline-block"></div>
            <div style= display:inline-block>10 - 30</div>
        </div>
        <div>
            <div style ="background:#00BFFF;height:10px; width:10px;display:inline-block"></div>
            <div style= display:inline-block>30 - 50</div>
        </div>
        <div>
            <div style ="background:#00ffff;height:10px; width:10px;display:inline-block"></div>
            <div style= display:inline-block>50 - 70</div>
        </div>
        <div>
            <div style ="background:#008b8b;height:10px; width:10px;display:inline-block"></div>
            <div style= display:inline-block>70 - 90</div>
        </div>
        <div>
            <div style ="background:#006400;height:10px; width:10px;display:inline-block"></div>
            <div style= display:inline-block>Greater than 90</div>
        </div>`;
    div.innerHTML = legendInfo; 
    return div
    }

    legend.addTo(myMap)
}





function makeMarkerOptions(feature){
    console.log(feature); 
    
    var depth = (feature.geometry.coordinates[2])
    var depthColor = "";
    if (depth >90) {
        depthColor = "#006400";
    } else if (depth >70) {
        depthColor = "#008b8b";
    } else if (depth > 50) {
        depthColor = "#00ffff"
    } else if (depth > 30) {
        depthColor = "#00BFFF"
    } else if (depth >10) {
        depthColor = "#0000CD"
    } else {
        depthColor = "#4169E1"
    }

    
    var geojsonMarkerOptions = {
        radius: (feature.properties.mag *5)+1,
        fillColor: depthColor,
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    return(geojsonMarkerOptions)

}

function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.place) {
        layer.bindPopup(feature.properties.title);
    }
}


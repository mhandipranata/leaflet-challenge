// Store our API link inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Creating map object
var map = L.map("map", {
    center: [39.50, -98.35],
    zoom: 5
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
}).addTo(map);

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    console.log(data.features);
    // createFeatures(data.features);

    // Give circle markers for each earthquake points
    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.6
    };

    function pointToLayer(geoJsonPoint, latlng){
        return L.circleMarker(latlng, geojsonMarkerOptions);
    } 

    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    L.geoJSON(data, {
        style: function(feature) {
            var qColor;
            if (feature.properties.mag <= 2) {
                qColor = '#035afc'
            }
            else if (feature.properties.mag > 2 && feature.properties.mag <= 4) {
                qColor = '#02bfa9'
            }
            else if (feature.properties.mag > 4 && feature.properties.mag <= 6) {
                qColor = '#058f03'
            }
            else {
                qColor = '#344001'
            };

            
            return {
                radius: feature.properties.mag*7,
                color: qColor,
                fillColor: qColor
            }
        },
        onEachFeature: onEachFeature,
        pointToLayer: pointToLayer
    }).addTo(map);

});


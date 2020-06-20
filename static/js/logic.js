// Store our API link inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Creating map object
var map = L.map("map", {
    center: [39.50, -98.35],
    zoom: 5
});

L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(map);

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    console.log(data.features);
    // createFeatures(data.features);

    // Give circle markers for each earthquake points
    var geojsonMarkerOptions = {
        radius: 7,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7
    };

    function pointToLayer(geoJsonPoint, latlng){
        return L.circleMarker(latlng, geojsonMarkerOptions);
    } 

    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + 
        "</p><hr><p> Magnitude: " + feature.properties.mag + "</p>"
        );
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    L.geoJSON(data, {
        style: function(feature) {
            var qColor;
            if (feature.properties.mag <= 1) {
                qColor = '#b7d7e8'
            }
            else if (feature.properties.mag > 1 && feature.properties.mag <= 2) {
                qColor = '#92a8d1'
            }
            else if (feature.properties.mag > 2 && feature.properties.mag <= 3) {
                qColor = '#d6d4e0'
            }
            else if (feature.properties.mag > 3 && feature.properties.mag <= 4) {
                qColor = '#b8a9c9'
            }
            else if (feature.properties.mag > 4 && feature.properties.mag <= 5) {
                qColor = '#6b5b95'
            }
            else {
                qColor = '#622569'
            };

            
            return {
                radius: feature.properties.mag*6,
                color: qColor,
                fillColor: qColor
            }
        },
        onEachFeature: onEachFeature,
        pointToLayer: pointToLayer
    }).addTo(map);

    // Create a legend on the bottom right corner of the map
    function colorLegend(m) {
        return m > 5 ? '#622569' :
        m > 4 ? '#6b5b95' :
        m > 3 ? '#b8a9c9' :
        m > 2 ? '#d6d4e0' :
        m > 1 ? '#92a8d1' :
        m > 0 ? '#b7d7e8':
        '#fff9eb';
    };

    var legend = L.control({
        position: "bottomright"
    });

    legend.onAdd = function() {
        var div = L.DomUtil.create('div', 'info legend');
        
        mag = [0,1,2,3,4,5];
        
        for (var i = 0; i < mag.length; i++) {
            div.innerHTML += '<i style="background:' + colorLegend(mag[i] + 1) + '"></i>' + mag[i] + (mag[i+1] ? '&ndash;' + mag[i+1] + '<br>' : '+');
        }
        return div;
    };

    legend.addTo(map);
});


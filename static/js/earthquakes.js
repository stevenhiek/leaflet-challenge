var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryUrl).then(function (data) {
console.log(data.features)
    // Map Starting Point
    var myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
    });

    // Base Map Layer
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    street.addTo(myMap);

    // Map Style: Earthquake Color and Radius 
    function earthquake_color(depth) {
        switch (true) {
            case depth >= 90: return "#ff5f65";
            case depth >= 70: return "#fca35d";
            case depth >= 50: return "#fdb72a";
            case depth >= 30: return "#f7db11";
            case depth >= 10: return "#dcf400";
            case depth <10: return "#a3f600";
        }
    };

    function earthquake_radius(mag) {
        if (mag == 0) {
            return 1;
        }
        return mag * 5;
    };

    // Circle Markers to Map and Earthquake Details
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: function (feature) {
            return {
                opacity: 1,
                fillOpacity: 0.8,
                fillColor: earthquake_color(feature.geometry.coordinates[2]),
                radius: earthquake_radius(feature.properties.mag),
                weight: 0.8
            }
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`<h3>Earthquake Information</h3><hr><p>
                                            Location: ${feature.properties.place}<br><br>
                                            Time: ${new Date(feature.properties.time)}<br><br>
                                            Magnitude: ${feature.properties.mag}<br><br>
                                            Depth: ${feature.geometry.coordinates[2]}</p>`);
        }
    }).addTo(myMap);

    // Legend Panel
    var legend = L.control({
        position: "bottomright"
    });
    legend.onAdd = function () {

        var div = L.DomUtil.create("div", "info legend");
        var labels = ["-10-10", "10-30", "30-50", "50-70", "70-90", "90+"];
        var colors = ["#a3f600", "#dcf400", "#f7db11", "#fdb72a", "#fca35d", "#ff5f65"];

        div.innerHTML += '<table>';
        for (var i = 0; i < labels.length; i++) {
            div.innerHTML +=
                "<i style='background: " + colors[i] + "'></i> " +
                labels[i] + "<br>";
        }
        return div;
    };
    legend.addTo(myMap)

});


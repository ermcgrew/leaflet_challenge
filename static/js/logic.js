async function main() {

    //circle radius = magnitude of the earthquake, higher magnitudes = larger circle
    function circleSize(magnitude) {
        return Math.pow(magnitude, 2) * 2000
    };

    //depth of the earthquake = color, greater depth = redder
    function circleColor(depth) {
        return depth < 10 ? '#00ff00':
                depth < 30 ? '#6AFF00':
                depth < 50 ? '#D4FF00':
                depth < 70 ? '#FFD300':
                depth < 90 ? '#FF6900':
                depth >= 90 ? '#ff0000':
                            "#252525";
    };

    //import geojson data on past 30 days of earthquakes from usgs.gov
    const geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
    const response =  await fetch(geoData);
    const data = await response.json();

    let earthquakes = data.features;
    
    //array to hold earthquake markers
    let quakeMarkers = [];

    //loop through each earthquake in the returned data and add to the map
    for (let i = 0; i < earthquakes.length; i++) {
        let location = earthquakes[i].geometry;
        let properties = earthquakes[i].properties;   
        
        //convert UTC date to ISO readable version
        const d = new Date(properties.time)
        let dateTime = d.toISOString()

        //data markers by long & lat
        quakeMarkers.push(
            L.circle([location.coordinates[1], location.coordinates[0]], {
            color: '#1C1918', //outside borderline color
            fillColor: circleColor(location.coordinates[2]), 
            fillOpacity: 0.75,
            radius: circleSize(properties.mag),
            weight: 1 //weight of outside borderline
        //popups with more info when marker is clicked
        }).bindPopup(`Location: ${properties.place}
            <br>Date and Time (UTC/GMT): ${dateTime} 
            <br>Magnitude: ${properties.mag}
            <br>Intensity: ${properties.mmi}
            <br>Alert Level: ${properties.alert}
            <br>How many people reported feeling this earthquake: ${properties.felt}`));
            
    };

    //add quake array to layer group
    let quakes = L.layerGroup(quakeMarkers);


    //import data on tectonic plates from repo tectonicplates
    const plateData = "./data/PB2002_boundaries.json" 
    const response2 =  await fetch(plateData);
    const plates = await response2.json();

    let plateGeos = plates.features;
    
    //put geojson into a layer with styling
    let geojsonLayer = L.geoJSON(plateGeos, {
        color: "yellow", 
        weight: 4,
        fillColor: "yellow",
        fillOpacity: 0
    }); 


    //create background tile layers
    const street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    const topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    //create objects to hold layers
    const baseMaps = {
        Street: street,
        Topography: topo
    };

    const overlayMaps = {
        "Earthquakes": quakes,
        "Tectonic Plates": geojsonLayer
    };

    // Create map object
      const myMap = L.map("map", {
        center: [35.9375, 14.3754],
        zoom: 3, 
        layers: [street, quakes, geojsonLayer]
    });

    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);


    //legend for colors, see https://leafletjs.com/examples/choropleth/
    //create legend as variable
    const legend = L.control({position:'bottomright'});
    
    //function to populate the legend
    legend.onAdd = function(myMap) {
        //create div for function to live in
        const div = L.DomUtil.create("div", "info legend");
        //array of steps that make up the color ranges
        const grades = [0,10,30,50,70,90];

        //add heading info to div
        const legendInfo = "<h3>Earthquake Depth (km)</h3>" +
            "<div class=\"labels\">" + "</div>";
        div.innerHTML = legendInfo;

        //for each interval of depths, 
        for (let i = 0; i < (grades.length); i++) {
            div.innerHTML += 
            "<i style= \"background-color: " + circleColor(grades[i]) + "\"></i>" + //add the color to a special <i> section
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + ' km<br>' : "+ km"); //add the number range, except for last position
        };

        return div;
      };

    //add legend to map
    legend.addTo(myMap);

};

main();
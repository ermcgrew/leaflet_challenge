async function main() {
  
    //create background tile layers
    const street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    const topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    const baseMaps = {
        Street: street,
        Topography: topo
    };
    
    // Create map object
      const myMap = L.map("map", {
        center: [37.6872, -97.3301],
        zoom: 5, 
        layers: [street]
    });

    // Add the layer control to the map.
    L.control.layers(baseMaps).addTo(myMap);

    //circle radius = magnitude of the earthquake, higher magnitudes = larger circle
    function circleSize(magnitude) {
        return Math.pow(magnitude, 2) * 2000
    };

    //depth of the earthquake = color, greater depth = darker in color
    function circleColor(depth) {
        // ['#fdbe85','#fd8d3c','#e6550d','#a63603', '#ff0000']
        return depth < 10 ? '#fdbe85':
                depth < 30 ? '#fd8d3c':
                depth < 50 ? '#e6550d':
                depth < 70 ? '#a63603':
                depth > 90 ? '#ff0000':
                            "#252525";
    };

    //import geojson data from usgs.gov
    const geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
    const response =  await fetch(geoData);
    const data = await response.json();

    let earthquakes = data.features;
    
    //loop through each earthquake in the returned data and add to the map
    for (let i = 0; i < earthquakes.length; i++) {
        let location = earthquakes[i].geometry;
        let properties = earthquakes[i].properties;   
        
        //convert UTC date to ISO readable version
        const d = new Date(properties.time)
        let dateTime = d.toISOString()

        //data markers by long & lat
        L.circle([location.coordinates[1], location.coordinates[0]], {
            color: circleColor(location.coordinates[2]), 
            fillOpacity: 0.75,
            radius: circleSize(properties.mag)
        //popups with more info when marker is clicked
        }).bindPopup(`Location: ${properties.place}
            <br>Date and Time (UTC/GMT): ${dateTime} 
            <br>Magnitude: ${properties.mag}
            <br>Intensity: ${properties.mmi}
            <br>Alert Level: ${properties.alert}
            <br>How many people reported feeling this earthquake: ${properties.felt}`)
        .addTo(myMap);
            
    };

    // //legend for colors
    // const legend = L.control({position:'bottomright'});

    // legend.onAdd = function() {
    //     const div = L.DomUtil.create("div", "info legend");
    //     const grades = [0,10,30,50,70,90];
    //     const labels = [];

    //     for (let i=0; i ,grades.length; i++){
    //         div.innerHTML += 
    //             'i style="background:' + circleColor(grades[i] + 1)
    //             + '"></i> ' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] 
    //             + '<br>' : '+');
    //     };

    //     return div;
    //   };

    // legend.addTo(myMap);

};

main();
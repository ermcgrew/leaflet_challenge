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

    //import geojson data from usgs.gov
    const geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
    
    const response =  await fetch(geoData);
    const data = await response.json();

    let earthquakes = data.features;


    for (let i = 0; i < earthquakes.length; i++) {

        let location = earthquakes[i].geometry;
            
            //data markers by long & lat
            if (location) {
                L.circle([location.coordinates[1], location.coordinates[0]], {
                    color: "green", //depth of the earthquake = color, greater depth = darker in color
                    fillOpacity: 0.75,
                    radius: 500 //circles = magnitude of the earthquake, higher magnitudes = larger
                }).addTo(myMap);
            };

    };
    

    
    

    //popups with more info when marker is clicked


    //legend for colors

};

main();
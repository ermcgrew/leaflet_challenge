# leaflet_challenge

Script to import and display earthquake data from USGS for the last 30 days. Map created with leaflet. Each earthquake plotted as separate point, with size varying by earthquake magnitude and color varying by depth. Each point also displays more information in popup on click. 

In this repo: 
* data folder: GeoJSON files of tectonic plates from https://github.com/fraxen/tectonicplates
* static folder:
    * css folder:
        * style.css: styling code for map and legend
    * js folder:
        * logic.js: javascript for importing data and creating leaflet map, earthquake data and tectonic plates as layers
* earthquake_map_screenshot.png: screenshot of deployed code on 1/12/2022
* index.html: html code to display map in browser
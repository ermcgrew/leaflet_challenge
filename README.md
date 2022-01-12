# leaflet_challenge

Script to import and display earthquake data from USGS for the last 30 days. Map created with leaflet. Each earthquake plotted as separate point, with size varying by earthquake magnitude and color varying by depth. Each point also displays more information in popup on click. 

In this repo: 
* static folder:
    * css folder:
        * style.css: styling code for map and legend
    * js folder:
        * logic_bonus.js: adds tectonic plates as additonal layer on leaflet map
        * logic.js: javascript for importing data and creating leaflet map
* index.html: html code to display map in browser
// Create light background tile layer
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});

// Initialize layer groups for different Earthquake strengths to be able to toggle them on and off
var layers = {
  ZERO_TO_ONE: new L.LayerGroup(),
  ONE_TO_TWO: new L.LayerGroup(),
  TWO_TO_THREE: new L.LayerGroup(),
  THREE_TO_FOUR: new L.LayerGroup(),
  FOUR_TO_FIVE: new L.LayerGroup(),
  FIVE_TO_MORE: new L.LayerGroup()
};

// Create the map and include layers
var map = L.map("map", {
  center: [38.708, 102.036288],
  zoom: 2,
  layers: [
    layers.ZERO_TO_ONE,
    layers.ONE_TO_TWO,
    layers.TWO_TO_THREE,
    layers.THREE_TO_FOUR,
    layers.FOUR_TO_FIVE,
    layers.FIVE_TO_MORE
  ]
});

// Add 'lightmap' tile layer to the map
lightmap.addTo(map);

// Create an overlays object to add to the layer control
var overlays = {
  "0 to 1": layers.ZERO_TO_ONE,
  "1 to 2": layers.ONE_TO_TWO,
  "2 to 3": layers.TWO_TO_THREE,
  "3 to 4": layers.THREE_TO_FOUR,
  "4 to 5": layers.FOUR_TO_FIVE,
  "5 to 6": layers.FIVE_TO_MORE
};

// Create a control for the layers and add to the map
L.control.layers(null, overlays).addTo(map);

// Create object with circle specifications for each earthquake size
var circles = {
  ZERO_TO_ONE: {
    color: '#66ff33',
    //fillColor: '#66ff33',
    fillOpacity: 0.75,
    radius: 500
  },
  ONE_TO_TWO: {
    color: '#ccff33',
    //fillColor: '#ccff33',
    fillOpacity: 0.75,
    radius: 1000
  },
  TWO_TO_THREE: {
    color: '#ffcc66',
    //fillColor: 'ffcc66',
    fillOpacity: 0.75,
    radius: 1500
  },
  THREE_TO_FOUR: {
    color: '#ff6600',
    //fillColor: '#ff6600',
    fillOpacity: 0.75,
    radius: 2000
  },
  FOUR_TO_FIVE: {
    color: '#ff4000',
    //fillColor: '#ff4000',
    fillOpacity: 0.75,
    radius: 3500
  },
  FIVE_TO_MORE: {
    color: '#ff0000',
    //fillColor: '#ff0000',
    fillOpacity: 0.75,
    radius: 7000
}};

// Perform an API call to the GEOJSON file
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(quakeData) {

    // Initialize a quakeSize variable, which will be used as a key to access the appropriate layers, icons, and earthquake size for layer group
    var quakeSize;

    // Loop through the quakeData
    for (var i = 0; i < quakeData.features.length; i++) {

      // If an earthquake magnitude is between 0 and 1, set quakeSize to ZERO_TO_ONE
      if (quakeData.features[i].properties.mag < 1) {
        quakeSize = "ZERO_TO_ONE";
      }
      // If an earthquake magnitude is between 1 and 2, set quakeSize to ONE_TO_TWO
      else if (quakeData.features[i].properties.mag < 2 && quakeData.features[i].properties.mag > 1) {
        quakeSize = "ONE_TO_TWO";
      }
      // If an earthquake magnitude is between 2 and 3, set quakeSize to TWO_TO_THREE
      else if (quakeData.features[i].properties.mag < 3 && quakeData.features[i].properties.mag > 2) {
        quakeSize = "TWO_TO_THREE";
      }
      // If an earthquake magnitude is between 3 and 4, set quakeSize to THREE_TO_FOUR
      else if (quakeData.features[i].properties.mag < 4 && quakeData.features[i].properties.mag > 3) {
        quakeSize = "THREE_TO_FOUR";
      }
      // If an earthquake magnitude is between 4 and 5, set quakeSize to FOUR_TO_FIVE
      else if (quakeData.features[i].properties.mag < 5 && quakeData.features[i].properties.mag > 4) {
        quakeSize = "FOUR_TO_FIVE";
      }
      // Otherwise the magnitude is greater than 5
      else {
        quakeSize = "FIVE_TO_MORE";
      }

      // Create a new circle with the appropriate icon and coordinates
      var newMarker = L.circle([quakeData.features[i].geometry.coordinates[1], quakeData.features[i].geometry.coordinates[0]], circles[quakeSize]);

      // Add the new circle to the appropriate layer
      newMarker.addTo(layers[quakeSize]);

      // Bind a popup to the marker that will display location and magnitude.
      newMarker.bindPopup("Quake Location: " + quakeData.features[i].properties.place + "<br> Quake Size: " + quakeData.features[i].properties.mag);
    }
    
  });

// Create function to select square color based on number in the array

  function getColor(d) {
    return d < 1? '#66ff33':
    d >= 1 && d < 2? '#ccff33':
    d >= 2 && d < 3? '#ffcc66':
    d >= 3 && d < 4? '#ff6600':
    d >= 4 && d < 5? '#ff4000':
    d >= 5? '#ff0000':
    '#ff0000';
    };

    // Create legend and move to the bottom right
    var legend = L.control({position: 'bottomright'});

    // Initialize legend to page when created
    legend.onAdd = function (map) { 

    // Create div for legend with class of info and legend, correlating to css properties
    var div = L.DomUtil.create('div', 'info legend')

    // Add Earthquake Strength label to top
    labels = ['<strong>Earthquake Strength</strong>'],
    grades = [0,1,2,3,4,5];

    // Generate colored boxes and mag size ranges to legend
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML += 
        '<i style=background:' + getColor(grades[i]) + '></i> ' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        
        return div;
        };

    // Add legend to the map
    legend.addTo(map);

    

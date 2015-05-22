//(function () {

	// EXERCISE 2 - Initialize Leaflet map here
	var map = L.map('map');


	// EXERCISE 3 - Set view and zoom
	map.setView([37.76, -122.45], 13);


	// EXERCISE 3 - Add basemap tiles
	// List of tile providers for leaflet 
	// http://leaflet-extras.github.io/leaflet-providers/preview/
	var tileURL = 'http://otile1.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png';

	var baselayer = L.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
	{
	  attribution: 'Tiles by <a href="http://www.mapquest.com/">Mapquest</a>, Data by <a href="http://www.openstreetmap.org/">OSM</a>',
	  maxZoom: 20,
	  minZoom: 12
	});

	map.addLayer(baselayer);


	// EXERCISE 4 - Load Census Tract polygons from geojson file

	var polygons;

	$.getJSON("../data/SF_CensusTracts.geojson",function(censusTracts){

		// instantiate L.geoJson layer object and add data recieved from ajax call
		polygons = L.geoJson(censusTracts).addTo(map);

	});

	// EXERCISE 4 - Load 2014 Burglary locations from SF OpenData API
	
	$.getJSON("https://data.sfgov.org/resource/v2gf-jivt.json?category=BURGLARY",function(data){
		console.log(data);
		// loop over data array, extract lat long values, create L.marker object for each location
		// add each marker to map
		for (var i = 0; i < data.length; i++) {
			var a = data[i];
			var latlng = new L.LatLng(a.location.latitude, a.location.longitude);     
			var marker = new L.Marker(latlng); // instantiate a new Leaflet marker
			map.addLayer(marker);
		}
	});


//}());
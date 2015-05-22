(function () {

	// BLOCK A - Initialize Leaflet map here
	var map = L.map('map');
	// BLOCK A - End




	// BLOCK B - Set view and zoom
	map.setView([37.76, -122.45], 13);
	// BLOCK B - End





	// BLOCK C - Add basemap tiles
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
	// BLOCK C - End




	// BLOCK D - Load Census Tract polygons from geojson file
	var polygons;

	$.getJSON("../data/SF_CensusTracts.geojson",function(censusTracts){

		// instantiate L.geoJson layer object and add data recieved from ajax call
		polygons = L.geoJson(censusTracts, {
			// style polygons by Inc2014
			style: function(feature){
				var color;
				var income = feature.properties.Inc2014;
				if ( income > 120000 ) color = "#4D004B";
				else if ( income > 100000 ) color = "#810F7C";
				else if ( income > 85000 ) color = "#88419D";
				else if ( income > 50000 ) color = "#8C6BB1";
				else if ( income > 20000 ) color = "#8C96C6";
				else color = "#BFD3E6";
				return { color: "#999", weight: 1, fillColor: color, fillOpacity: .6 };
			},

			// bind popup to each polygon
			onEachFeature: function( feature, layer ){
				layer.bindPopup( "<strong>Tract# " + feature.properties.SpatialID + "</strong><br/>Income $" + feature.properties.Inc2014 + " " )
			}

		}).addTo(map);

	});
	// BLOCK D - End




	// BLOCK E - Load 2014 Burglary locations
	$.getJSON("../data/SFPD_Burglaries_2014.geojson",function(data){
		// define custom icon
		var burglarIcon = L.icon({
			iconUrl: 'icon/Criminal_Silhouette.svg',
			iconSize: [45,50]
		});

		// create geojson layer and assign it to a variable (burglaries)
		var burglaries = L.geoJson(data,{
			pointToLayer: function(feature,latlng){
				var marker = L.marker(latlng,{icon: burglarIcon});
				marker.bindPopup(feature.properties.Descript + '<br/>RESOLUTION: ' + feature.properties.Resolution);
				return marker;
			}
		});

		// create a variable called clusters
		// add burglaries to clusters
    	// add clusters to map
		var clusters = L.markerClusterGroup();
		clusters.addLayer(burglaries);
		map.addLayer(clusters);

	});
	// BLOCK E - End




	// BLOCK F - Load 2014 Burglary locations from API
	// Issues with the url.

	/*	$.getJSON("https://data.sfgov.org/resource/v2gf-jivt.json?category=BURGLARY",function(data){
		console.log(data.length);
		// loop over data array, extract lat long values, create L.marker object for each location
		// add each marker to map
		for (var i = 0; i < data.length; i++) {
			var a = data[i];
			var latlng = new L.LatLng(a.location.latitude, a.location.longitude);     
			var marker = new L.Marker(latlng); // instantiate a new Leaflet marker
			map.addLayer(marker);
		}
	});*/
	// BLOCK F - End

	//BLOCK G - Add legend and title
	// add custom control for legend
	var legend = L.control({position: 'topright'});

	legend.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'legend');
		div.innerHTML = "<h2>2014 Burglary Count</h2>";
		div.innerHTML += "<small>Median Household Income</small>";
		div.innerHTML += "<nav class='legend clearfix'>" + 
		"<span style='background:#BFD3E6;'></span>" +
		"<span style='background:#8C96C6;'></span>" +
		"<span style='background:#8C6BB1;'></span>" + 
		"<span style='background:#88419D;'></span>" + 
		"<span style='background:#810F7C;'></span>" + 
		"<label>0 - 20K</label>" + 
		"<label>50K</label>" + 
		"<label>85K</label>" + 
		"<label>100K</label>" + 
		"<label>120K</label>" + 
		"<small>Source: <a href='https://data.sfgov.org'>SF Open Data</a></small></nav>"
		return div;
	};

	legend.addTo(map);
	//BLOCK G - End


}());

var geocoder;
var map;
var markers = new Array();
var marker;
var infowindows = new Array();
var bar = new google.maps.MarkerImage('mapicons/bar2.png');
var brew = new google.maps.MarkerImage('mapicons/brewery1.png');
var liquor = new google.maps.MarkerImage('mapicons/liquor.png');
var growler = new google.maps.MarkerImage('mapicons/growler.png');
var icons = new Array();
var service;
var detailInfo;
var clicks = 0;

icons['DRAUGHT'] = bar;
// icons['GROWLER'] = liquor;
icons['GROWLER'] = growler;
icons['brewery'] = brew;


function start()
{
		
	geocoder = new google.maps.Geocoder();
	// var latlng = new google.maps.LatLng(41.6294626, -70.38749540000003);
	var latlng = new google.maps.LatLng(41.82, -70.36);
	var myOptions = {
		zoom: 10,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
		// , streetViewControl: true
	};
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	// map = $('#map_canvas').gmap3(myOptions);
	service = new google.maps.places.PlacesService(map);
	
	var addr = "1336 Phinney's Lane Hyannis, MA 02601";
	var title = "Cape Cod Beer Brewery";
	var phone = "508-790-4200";
	
	
	geocoder.geocode( { 'address': addr}, function(results, status) 
		{	
			if (status == google.maps.GeocoderStatus.OK) 
			{	
			// map.setCenter(results[0].geometry.location);

			var contentString = "<p><strong>" + title + "</strong><br />"+ addr + "<br />" + phone + "</p>";

			marker = new google.maps.Marker({
				map: map, 
				position: 	results[0].geometry.location,
				title: 		title,
				icon: 		brew
	
			});
			marker['cust_id'] = 0;

			marker.setAnimation(google.maps.Animation.DROP);

			infowindow = new google.maps.InfoWindow({
			    content: contentString
			});
			infowindow.open(map, marker);
			markers.push(marker);
			infowindows.push(infowindow);
		}
		
	});

}

function getMap(list) 
{	
		var i = 0;
		var addr;
		var cust_id;
		var cust_name;
		var cust_data;
		var beer;
		var region;
		var channel;
		var phone;
		var type;
		var web;
		var c = markers.length;
		for(i; i <  list.length; i++)
		{	
			cust_id 	= list[i].id;
			cust_name 	= list[i].name;
			addr 		= list[i].street + '; ' + list[i].city + ', '+ list[i].state + ' '+ list[i].zip;
			zip 		= list[i].zip;
			phone	 	= list[i].phone;		
			beer 		= list[i].beer.toString();
			type 		= list[i].type;
			latest 		= list[i].latest;
			region 		= list[i].region;
			lat			= list[i].lat;
			lng			= list[i].lng;
			web			= list[i].web;

			codeAddress(cust_id, cust_name, addr, phone, beer, type, latest, region, zip, lat, lng, web);
		}		

 }

function codeAddress(cust_id, cust_name, addr, phone, beer, type, latest, region, zip, lat, lng, web, place) 
{   
	var marker = new google.maps.Marker({
		position	: 	new google.maps.LatLng(lat, lng),	//results[0].geometry.location,
		title		: 	cust_name,
		icon		: 	icons[type]							
	});
	
	marker['beer']	 	= 	beer.toString();
	marker['zip']		= 	zip;
	marker['cust_id']	=	cust_id;
	marker['type'] 		=	type;
	marker['latest']	=	latest;
	marker['region']	=	region;
	marker['place'] = '';
	marker['place']['rating'] = "";
	marker['place']['url'] = "";
				
	 var request = {
	    	location: marker.position,
		    radius: '100',
		    name: marker.title
	  };
		service.search(request, function(results, status) 
			{
				for(i=0; i<results.length; i++)
				{
					var place = results[i];
					var request = {reference : place.reference};
				 	service.getDetails(request, function(place, status)
					{
						marker['place'] =  place; 
						// console.log(marker);
						// console.log(marker['place']['rating']);
					});
				}
			});
		
			
				var contentString = "<p><strong>" + cust_name + "</strong><br />"+ addr + "<br />"+phone+"<br /><br />Brand(s): " + beer + "<br />Type: " + type + "</p>";
				contentString += "<p><a href='"+web+"' target='_blank'>"+web+"<br /><a href='http://maps.google.com/maps?q=" + addr + "' target='_blank'>Get directions</a></p>";
			var infowindow = new google.maps.InfoWindow({
			    content: contentString
			});						
				if(marker['place']['rating'])
			{
				infowindow.content += "<p>Rating: " + marker['place']['rating'] +"</p>";
			}
			if(marker['place']['url'])
			{
				infowindow.content += "<p><a href='"+marker['place']['url']+"' target='_blank'>Full Details</a></p>";	
			}

			var marker_event = google.maps.event.addListener(marker, 'click', function(event) 
			{
				for(y = 0; y < infowindows.length; y++)
				{
					infowindows[y].close();
				}
					infowindow.open(map, marker);
			});
	
			marker.marker_event = marker_event;
			markers.push(marker);
			infowindows.push(infowindow);
}

function callback(results, status) 
{
	
	{
		for (var i = 0; i < results.length; i++) 
		{
			var place = results[i];
			// console.log(place.reference);
			// service = 	google.maps.places.PlacesService(map); 
			var request = {reference : place.reference};
			// service = new google.maps.places.PlacesService(map);
		 	service.getDetails(request, getDet);

		}
		
	}

}

function getDet(place, status)
{
	return place;
	// console.log(status);
}

function getCoord(cst)
{	
	if(!geocoder) 
	{
		geocoder = new google.maps.Geocoder();
	}
	// console.log(cust);
		var addr = cst.street + '; ' + cst.city + ', '+ cst.state + ' '+ cst.zip;
		// console.log(addr);
		geocoder.geocode({'address': addr}, function(results, status) 
			{
				cst.lat = results[0].geometry.location.Ha;
				cst.lng = results[0].geometry.location.Ia;
				// console.log("2. inside getCoord:" + cst.lat);
				saveCoord(cst);
			});
	// console.log(cust);
		// return cust;
	
}


function saveCoord(val)
{
	var blah = {id : val.id, lat : val.lat, lng : val.lng, action : 'save'};
	
		// console.log("3. inside saveCoord: " + val.lat);
			$.ajax({
				url		: 	'functions.php', 
				type	: 	"POST", 
				data	: 	blah,	
				success : 	function(data,msg,xhr)
				{
					// console.log(data);
				}
			});

	
}


function findBeer(beertype)
{ 
	for(b = 1; b < markers.length; b++)
	{	
		if(markers[b].beer != beertype)
		{
			markers[b].hide();
		}
		else
		{
			markers[b].show();
		}
	}
}

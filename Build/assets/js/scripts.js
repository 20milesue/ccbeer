				$(document).ready(function($) {
					var yourStartLatLng = new google.maps.LatLng(41.616645,-70.518862);
					
					var myOptions = {
						zoom: 10,
						center: yourStartLatLng,
						mapTypeId: google.maps.MapTypeId.ROADMAP
					};

	                // $('#map_canvas').gmap({'center': yourStartLatLng, 'zoom': 10});

					var	marker = new google.maps.Marker({
								map: map, 
								position: 	yourStartLatLng,
								title: 		'Company Name'	});
					start();
	// $('#map_canvas').gmap('addMarker', marker);						
				});

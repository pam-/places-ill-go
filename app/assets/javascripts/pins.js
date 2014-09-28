function initialize() {
	var mapOptions = {
		zoom: 3,
		center: new google.maps.LatLng(32.397, -6)
	};

	var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	// display latitudes
	$.ajax({
		url: '/pins.json',
		dataType: 'json',
		success: function(result){
			return render(result);
		}
	})

	function render(result){
		for (var i = 0; i < result.length; i++) {
			pin = result[i];
			new google.maps.Marker({
				position: new google.maps.LatLng(pin.latitude, pin.longitude),
				map: map
			})
		};
	}

	google.maps.event.addListener(map, 'click', function(event) {
		var latitude = event.latLng.lat();
		var longitude = event.latLng.lng();
		// alert(latitude)
		newLocation = new google.maps.LatLng(latitude, longitude);
	  $.ajax({
	  	type: 'POST',
	  	url: '/pins',
	  	dataType: 'json',
	  	data: { pin: {
	  			longitude: longitude,
	  			latitude: latitude 
	  		}
	  	},
	  	success: new google.maps.Marker({
	  		position: newLocation,
	  		map: map
	  	})
  	});
	});
}

function loadScript() {
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' +
      'callback=initialize';
  document.body.appendChild(script);
}

window.onload = loadScript;
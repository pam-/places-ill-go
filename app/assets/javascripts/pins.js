var geocoder;

function initialize() {
	var mapOptions = {
		zoom: 3,
		center: new google.maps.LatLng(32.397, -6)
	};

	var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	geocoder = new google.maps.Geocoder();

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
			// addToList(pin.latitude, pin.longitude);		
			new google.maps.Marker({
				position: new google.maps.LatLng(pin.latitude, pin.longitude),
				map: map
			})
		};
	}

	google.maps.event.addListener(map, 'click', function(event) {
		var latitude = event.latLng.lat();
		var longitude = event.latLng.lng();
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
	  	success: function(){
		  	new google.maps.Marker({
		  		position: newLocation,
		  		map: map
		  	})
		  	codeLatLng(latitude, longitude);
	  	}
  	})
	});

	function codeLatLng(latitude, longitude){
		var lat = latitude;
		var lng = longitude;
		var latLng = new google.maps.LatLng(lat, lng);
		geocoder.geocode({'latLng': latLng}, function(results, status){
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[1]) {
					addToList(results[1].formatted_address)
				} else {
					alert('No results found');
				}
			}	else {
				alert('Geocoder failed due to: ' + status);
			}
		});
	}

	function addToList(address){
		var ul = document.getElementsByTagName('ul')[0];
		var li = document.createElement('li');
		li.appendChild(document.createTextNode(address));
		ul.appendChild(li);
	}	

	var expander = document.getElementById('expand');
	var arrow = document.getElementsByTagName('p')[0];
	var places = document.getElementsByClassName('details')[0];
	expander.addEventListener('click', function(){
		expander.classList.toggle('clicked');
		if (expander.className === 'clicked') { 
			arrow.innerHTML = '<'; 
		} else {
			arrow.innerHTML = '>';
		}
		places.classList.toggle('clicked');
		var mapContainer = document.getElementsByClassName('map-container')[0];
		mapContainer.classList.toggle('expanded');
	})

}

function loadScript() {
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' +
      'callback=initialize';
  document.body.appendChild(script);
}

window.onload = loadScript;


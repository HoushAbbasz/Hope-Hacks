let map;

function initMap() {
    const charlotte = { lat: 35.2271, lng: -80.8409 };
    
    // initialize new google map object centered on Charlotte, NC
    map = new google.maps.Map(document.getElementById('map'), {
        center: charlotte,
        zoom: 10,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        restriction: {
            latLngBounds: calculateBounds(charlotte, 25), 
            strictBounds: true
        }
    });
    
    // initialize geocoder to convert addresses to lat/long coordinates
    const geocoder = new google.maps.Geocoder();
    
    // list of addresses to geocode and add markers for, these will not be hard coded in the real app
    const addresses = [
        {
            address: '5000 Whitewater Center Parkway Charlotte, NC 28214',
            title: 'Whitewater Center',
            label: '1'
        },
        {
            address: '5501 Josh Birmingham Pkwy, Charlotte, NC 28208',
            title: 'Charlotte Douglas International Airport',
            label: '2'
        },
        {
            address: '4400 Sharon Rd, Charlotte, NC 28211',
            title: 'SouthPark Mall',
            label: '3'
        }
    ];
    
    
    addresses.forEach(location => {
        // for each address, use geocoder to get coordinates from address
        geocoder.geocode({ address: location.address }, (results, status) => {
            // if geocoding was successful
            if (status === 'OK') {
                const marker = new google.maps.Marker({
                    position: results[0].geometry.location,
                    map: map,
                    // set marker title and label from location data
                    title: location.title,
                    label: location.label
                });
                ma
                const infoWindow = new google.maps.InfoWindow({
                    content: `<strong>${location.title}</strong><br>${location.address}`
                });
                
                marker.addListener('click', () => {
                    infoWindow.open(map, marker);
                });

            // prints error message if geocoder could not find address
            } else {
                console.error('Geocode failed for ' + location.address + ': ' + status);
            }
        });
    });
}

function calculateBounds(center, borderInMiles) {
    // convert radius from miles to kilometers
    const borderInKm = borderInMiles * 1.60934;
    const lat = center.lat;
    const lng = center.lng;
    
    // calculate latitude and longitude offsets in degrees
    // earth's circumerence is 40075 km, so 1 degree latitude is about 111 km
    const latOffset = borderInKm / 111.0;
    const longOffset = borderInKm / 111.0;
    
    return {
        north: lat + latOffset,
        south: lat - latOffset,
        east: lng + longOffset,
        west: lng - longOffset
    };
}

// waits for DOM to load before fetching API key 
window.addEventListener('DOMContentLoaded', () => {
    fetch('/api/config')
        .then(response => response.json())
        .then(config => {
            // append google maps script tag with API key to document body
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${config.googleMapsApiKey}&callback=initMap`;
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
        })
        .catch(error => {
            console.error('Error loading API key:', error);
        });
});
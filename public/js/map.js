let map;
let userMarker = null;
let destinationMarker = null;
let allMarkers = [];
let currentMode = 'nearest';
let mapBounds; 
let directionsService;
let directionsRenderer;

function initMap() {

    // define charlotte coordinates
    const charlotte = { lat: 35.2271, lng: -80.8409 };
    
    // calculate and store bounds for later validation
    mapBounds = calculateBounds(charlotte, 25);
    
    // initialize new google map object centered on charlotte, with controls and restrictions
    map = new google.maps.Map(document.getElementById('map'), {
        center: charlotte,
        zoom: 11,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        restriction: {
            latLngBounds: mapBounds,
            strictBounds: true
        }
    });
    
    // initialize directions service and renderer
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: false,
        polylineOptions: {
            strokeColor: '#4285f4',
            strokeWeight: 5
        }
    });
    
    const geocoder = new google.maps.Geocoder();
    
    // legal assistance locations
    const legalLocations = [
        { address: '5535 Albemarle Rd, Charlotte, NC 28212', title: 'Charlotte Center for Legal Advocacy', pNum: '(704) 376-1600' },
        { address: '1611 E 7th St, Charlotte, NC 28204', title: 'International House', pNum: '(704) 333-8099' },
        { address: '4938 Central Ave #101, Charlotte, NC 28205', title: 'Latin American Coalition', pNum: '(704) 531-3848' },
        { address: '6100 Fairview Rd #1145, Charlotte, NC 28210', title: 'Elizabeth Rosario Law, PLC - Immigration Lawyer', pNum: '(704) 520-2199' },
        { address: '6135 Park S Dr suite 510, Charlotte, NC 28210', title: 'Ify Immigration Law Firm' , pNum: '(919) 925-2295' },
        { address: '3117 Whiting Ave, Charlotte, NC 28205', title: 'VíaLegal Immigration', pNum: '(980) 443-5141' },
        { address: '207 Regency Executive Park Dr Ste 120, Charlotte, NC 28217', title: 'Pardo Law Firm, PLLC.', pNum: '(704) 644-7065' },
        { address: '5244 N Sharon Amity Rd, Ste A, Charlotte, NC 28215', title: 'The Gilchrist Law Firm', pNum: '(980) 219-8884' },
        { address: '6100 Fairview Rd, Ste 200, Charlotte, NC 28210', title: 'Garfinkel Immigration Law Firm', pNum: '(704) 442-8000' },
        { address: '6135 Park South Dr, Ste 593, Charlotte, NC 28210', title: 'Powers Immigration Law - Charlotte', pNum: '(704) 556-1156' },
        { address: '10150 Mallard Creek Rd #105, Charlotte, NC 28262', title: 'Law Office of Kelli Y. Allen, PLLC', pNum: '(704) 870-0340' },
        { address: '402 W Trade St #100, Charlotte, NC 28202', title: 'Cauley Forsythe Immigration', pNum: '(704) 522-6363' }
    ];
    
    // counter to track how many locations have been successfully geocoded
    let geocodedCount = 0;
    
    // loop through each location in the combined array
    legalLocations.forEach(location => {
        // call the geocode method to convert the address to lat/lng coordinates
        geocoder.geocode({ address: location.address }, (results, status) => {
            if (status === 'OK') {
                const marker = new google.maps.Marker({
                    position: results[0].geometry.location,
                    map: map,
                    title: location.title,
                    opacity: 1.0,
                    locationData: {
                    title: location.title,
                    address: location.address,
                    pNum: location.pNum,  
                    position: results[0].geometry.location
                    }
                });
                
                // add this marker to the global array of all markers
                allMarkers.push(marker);
                
                // create an info window for this marker
                const infoWindow = new google.maps.InfoWindow({
                    content: `<strong>${location.title}</strong><br>${location.address}`
                });
                
                marker.addListener('click', () => {
                    // when marker is clicked, open the info window at the marker's location
                    infoWindow.open(map, marker);
                });
                
                // increment the counter of successfully geocoded locations
                geocodedCount++;
                if (geocodedCount === legalLocations.length) {
                    // once all markers are loaded, enable the search functionality and filter buttons functionality
                    setupSearch(geocoder);
                    setupFilters();
                    // display all locations on page load
                    showAllLocations();
                }
            } else {
                // if geocoding fails, log an error to the console
                console.error('Geocode failed for ' + location.address + ': ' + status);
            }
        });
    });
}

function setupSearch(geocoder) {
    const searchButton = document.getElementById('searchButton');
    const addressInput = document.getElementById('addressInput');
    const currentLocationBtn = document.getElementById('currentLocationBtn');
    
    // if search button or input field don't exist, exit the function
    if (!searchButton || !addressInput) return;
    
    searchButton.addEventListener('click', () => {
        const address = addressInput.value.trim();
        // if an address was entered, find and display the nearest markers to this address
        if (address) {
            currentMode = 'nearest';
            findNearestMarkers(geocoder, address);
        }
    });
    
    // add keypress event listener to the address input field, does the same thing as the search button when "enter" is pressed
    addressInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const address = addressInput.value.trim();
            if (address) {
                currentMode = 'nearest';
                findNearestMarkers(geocoder, address);
            }
        }
    });
    
    if (currentLocationBtn) {
        currentLocationBtn.addEventListener('click', () => {
            if (navigator.geolocation) {
                currentLocationBtn.textContent = 'Getting location...';
                // request the user's current gps position
                navigator.geolocation.getCurrentPosition(
                    // success callback function when location is obtained
                    (position) => {
                        currentMode = 'nearest';
                        // create an object with the user's latitude and longitude
                        const userLocation = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude  
                        };
                        
                        // if location is not within bounds
                        if (!isWithinBounds(userLocation)) {
                            alert('Your location is outside the Charlotte area. Please enter a Charlotte area address.');
                            currentLocationBtn.textContent = '📍 Use Current Location';
                            return;
                        }
                        
                        // find and display the nearest markers to this location
                        findNearestMarkersFromCoords(userLocation);
                        currentLocationBtn.textContent = '📍 Use Current Location';
                    },
                    // error callback function if location cannot be obtained
                    (error) => {
                        alert('Could not get your location. Please enter an address instead.');
                        currentLocationBtn.textContent = '📍 Use Current Location';
                    }
                );
            } else {
                // if browser doesn't support geolocation, show alert
                alert('Geolocation is not supported by your browser.');
            }
        });
    }
}

// function to check if a location is within the map bounds
function isWithinBounds(location) {
    return location.lat >= mapBounds.south && 
           location.lat <= mapBounds.north && 
           location.lng >= mapBounds.west && 
           location.lng <= mapBounds.east;
}

// function to set up the filter buttons for browsing by category
function setupFilters() {
    const showAllBtn = document.getElementById('showAllBtn');
    if (showAllBtn) {
        showAllBtn.addEventListener('click', () => {
            currentMode = 'filter';
            // display all locations on the map
            showAllLocations();
        });
    }
}

// function to show all locations on the map without filtering
function showAllLocations() {
    // clear any existing directions
    directionsRenderer.setDirections({routes: []});

    // if user marker exists, remove it from the map
    if (userMarker) {
        userMarker.setMap(null);
        userMarker = null;
    }
    
    // if destination marker exists, remove it from the map
    if (destinationMarker) {
        destinationMarker.setMap(null);
        destinationMarker = null;
    }
    
    allMarkers.forEach(marker => {
        // show each marker on the map
        marker.setMap(map);
        marker.setOpacity(0.7);
    });
    
    // display all markers as cards in the sidebar, adjust the map zoom and center to fit all visible markers
    displayCards(allMarkers, 'All Legal Assistance Locations');
    fitMapToMarkers(allMarkers);
}

// function to find nearest markers from a entered address or user's location
function findNearestMarkers(geocoder, userAddress) {
    // geocode the user's address to get coordinates
    geocoder.geocode({ address: userAddress }, (results, status) => {
        if (status === 'OK') {
            // extract the location coordinates from the first result
            const userLocation = results[0].geometry.location;
            
            // check if the address is within bounds
            const locationObj = {
                lat: userLocation.lat(),
                lng: userLocation.lng()
            };
            
            if (!isWithinBounds(locationObj)) {
                alert('This address is outside the Charlotte area. Please enter a Charlotte area address.');
                return;
            }
            
            // find nearest markers
            findNearestMarkersFromCoords(userLocation, userAddress);
        } else {
            alert('Address not found. Please try again with a Charlotte area address.');
        }
    });
}

// function to find nearest markers from coordinates 
function findNearestMarkersFromCoords(userLocation, address = 'Your Location') {
    // clear any existing directions
    directionsRenderer.setDirections({routes: []});
    
    // show all markers on the map initially
    allMarkers.forEach(marker => {
        marker.setMap(map);
    });
    
    // if old user marker exists, remove it from the map
    if (userMarker) {
        userMarker.setMap(null);
    }
    
    // if old destination marker exists, remove it from the map
    if (destinationMarker) {
        destinationMarker.setMap(null);
        destinationMarker = null;
    }
    
    let userLatLng;
    // check if userlocation is a plain javascript object with lat and lng numbers
    if (userLocation.lat && userLocation.lng && typeof userLocation.lat === 'number') {
        // convert plain object to google maps latlng object
        userLatLng = new google.maps.LatLng(userLocation.lat, userLocation.lng);
    } else {
        // userlocation is already a google maps latlng object
        userLatLng = userLocation;
    }
    
    // create a red marker at the user's location
    userMarker = new google.maps.Marker({
        position: userLatLng,
        map: map,
        title: 'Your Location',
        // use red icon to distinguish from location markers
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#FF0000',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2
        },
        zIndex: 1000 // ensure the red marker appears on top
    });
    
    // add info window to user marker
    const userInfoWindow = new google.maps.InfoWindow({
        content: `<strong>Your Location</strong><br>${address}`
    });
    
    userMarker.addListener('click', () => {
        userInfoWindow.open(map, userMarker);
    });
    
    // center the map on the user's location
    map.setCenter(userLatLng);
    map.setZoom(12);
    
    // find, highlight, and display the nearest marker and side card of each label type to the user
    const nearest = findNearestByLabel(userLatLng);
    highlightNearestMarkers(nearest);
    displayNearestCards(nearest, address, userLatLng);
}

// finds the nearest marker to a given location
function findNearestByLabel(userLocation) {
    let closestMarker = null;
    let closestDistance = Infinity;
    
    // loop through all markers to find the closest one
    allMarkers.forEach(marker => {
        // calculate distance from user location to this marker
        const distance = calculateDistance(userLocation, marker.getPosition());
        
        // check if this distance is shorter than current closest
        if (distance < closestDistance) {
            closestDistance = distance;
            // create object with marker data and distance
            closestMarker = {
            title: marker.locationData.title,
            address: marker.locationData.address,
            pNum: marker.locationData.pNum,  
            distance: distance,
            marker: marker,
            position: marker.getPosition()
            };
        }
    });
    
    return closestMarker;
}

// function to calculate distance between two coordinates
function calculateDistance(pos1, pos2) {
    const meters = google.maps.geometry.spherical.computeDistanceBetween(pos1, pos2);
    // convert meters to miles
    return meters * 0.000621371;
}

// function to highlight only the nearest marker and hide all others
function highlightNearestMarkers(nearest) {
    // loop through all markers and hide them
    allMarkers.forEach(marker => {
        marker.setMap(null);
        marker.setAnimation(null);
    });
    
    // check if a nearest marker was found
    if (nearest) {
        // make this marker fully visible
        nearest.marker.setMap(map);
        nearest.marker.setOpacity(1.0);

        // make this marker bounce for 1.5 secs
        nearest.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => {
            nearest.marker.setAnimation(null);
        }, 1500);
    }
}

// function to get and display directions
function getDirections(origin, destination, destinationAddress) {
    // remove old destination marker
    if (destinationMarker) {
        destinationMarker.setMap(null);
    }
    
    // hide all location markers
    allMarkers.forEach(marker => {
        marker.setMap(null);
    });
    
    // create new blue marker for destination
    destinationMarker = new google.maps.Marker({
        position: destination,
        map: map,
        title: 'Destination',
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#4285F4',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2
        },
        zIndex: 999
    });
    
    // create or update red marker for origin
    if (!userMarker) {
        userMarker = new google.maps.Marker({
            position: origin,
            map: map,
            title: 'Your Location',
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#FF0000',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 2
            },
            zIndex: 1000
        });
    } else {
        // make sure user marker is visible and red
        userMarker.setMap(map);
        userMarker.setIcon({
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#FF0000',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2
        });
    }
    
    const request = {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING
    };
    
    directionsService.route(request, (result, status) => {
        if (status === 'OK') {
            // display route on map with custom markers
            directionsRenderer.setOptions({
                suppressMarkers: true // suppress default a/b markers
            });
            directionsRenderer.setDirections(result);
            
            // display turn-by-turn directions in sidebar
            displayDirectionsPanel(result, destinationAddress);
        } else if (status === 'REQUEST_DENIED') {
            // log more details for debugging
            console.error('Directions API REQUEST_DENIED. Check:', {
                status: status,
                origin: origin,
                destination: destination
            });
            
            
        } else {
            console.error('Directions error:', status);
            alert('Could not calculate directions: ' + status);
        }
    });
}

// function to display turn-by-turn directions
function displayDirectionsPanel(directionsResult, destinationAddress) {
    const cardsContainer = document.getElementById('cardsContainer');
    const route = directionsResult.routes[0];
    const leg = route.legs[0];
    
    let html = `
        <div class="directions-header">
            <button id="backButton" class="back-btn">← Back to Locations</button>
            <h3>Directions</h3>
        </div>
        <div class="directions-summary">
            <div class="summary-item">
                <strong>To:</strong> ${destinationAddress}
            </div>
            <div class="summary-item">
                <strong>Distance:</strong> ${leg.distance.text}
            </div>
            <div class="summary-item">
                <strong>Estimated Time:</strong> ${leg.duration.text}
            </div>
        </div>
        <div class="directions-steps">
            <h4>Directions:</h4>
    `;
    
    leg.steps.forEach((step, index) => {
        // remove html tags from instructions
        const instruction = step.instructions.replace(/<[^>]*>/g, '');
        
        // format the instruction more naturally
        let formattedInstruction = instruction;
        if (index === 0) {
            formattedInstruction = `Start by heading ${instruction.toLowerCase().replace('head ', '')}`;
        }
        
        html += `
            <div class="direction-step">
                <div class="step-number">Step #${index + 1}</div>
                <div class="step-content">
                    <div class="step-instruction">${formattedInstruction}</div>
                    <div class="step-distance">Go ${step.distance.text}</div>
                </div>
            </div>
        `;
    });
    
    // add final destination step
    html += `
        <div class="direction-step destination-step">
            <div class="step-content">
                <div class="step-instruction"><strong>You've arrived at your destination</strong></div>
                <div class="step-distance">${destinationAddress}</div>
            </div>
        </div>
    `;
    
    html += `</div>`;
    cardsContainer.innerHTML = html;
    
    // add back button functionality
    document.getElementById('backButton').addEventListener('click', () => {
        // clear directions
        directionsRenderer.setDirections({routes: []});
        
        // remove destination marker
        if (destinationMarker) {
            destinationMarker.setMap(null);
            destinationMarker = null;
        }
        
        // show the location card again
        if (userMarker) {
            const nearest = findNearestByLabel(userMarker.getPosition());
            displayNearestCards(nearest, 'Your Location', userMarker.getPosition());
        } else {
            showAllLocations();
        }
    });
}

// function to display the nearest location as a card in the sidebar
function displayNearestCards(nearest, userAddress, userLocation = null) {
    const cardsContainer = document.getElementById('cardsContainer');
    
    let html = `<h3 class="text-base font-bold mb-4">Nearest to: ${userAddress}</h3>`;
    
    if (nearest) {
        html += `
            <div class="bg-white rounded-xl border border-black/10 p-4 shadow-sm hover:shadow-md transition mb-4">
                <div class="text-xs font-semibold text-[#669BBC] uppercase mb-2">Legal Assistance</div>
                <div class="text-lg font-bold text-[#242423] mb-2">${nearest.title}</div>
                <div class="text-sm font-semibold text-[#34a853] mb-2">${nearest.distance.toFixed(2)} miles away</div>
                <div class="text-sm text-[#242423]/70 mb-2">${nearest.address}</div>
                <div class="text-sm text-[#669BBC] font-semibold mb-3">📞 ${nearest.pNum || 'Phone not available'}</div>
                <button class="directions-btn w-full px-4 py-2 rounded-lg bg-[#669BBC] text-white font-semibold hover:bg-[#242423] transition" 
                        data-lat="${nearest.position.lat()}" 
                        data-lng="${nearest.position.lng()}" 
                        data-address="${nearest.address}" 
                        data-origin-lat="${userLocation ? userLocation.lat() : ''}" 
                        data-origin-lng="${userLocation ? userLocation.lng() : ''}">
                    Get Directions
                </button>
            </div>
        `;
    }
    
    html += `</div>`;
    cardsContainer.innerHTML = html;
    
    // add click handlers for directions buttons
    setupDirectionsButtons();
}

// function to display multiple locations as cards 
function displayCards(markers, title) {
    // get the cards container element from html
    const cardsContainer = document.getElementById('cardsContainer');
    
    // start building html string with title
    let html = `<h3 class="text-base font-bold mb-4">${title}</h3>`;
    
    // loop through each marker
    markers.forEach(marker => {
        // get the location data from the marker
        const data = marker.locationData;
        const pos = marker.getPosition();
        // add html for a location card
    html += `
        <div class="bg-white rounded-xl border border-black/10 p-4 shadow-sm hover:shadow-md transition mb-4">
            <div class="text-xs font-semibold text-[#669BBC] uppercase mb-2">Legal Assistance</div>
            <div class="text-lg font-bold text-[#242423] mb-2">${data.title}</div>
            <div class="text-sm text-[#242423]/70 mb-2">${data.address}</div>
            <div class="text-sm text-[#669BBC] font-semibold mb-3">📞 ${data.pNum || 'Phone not available'}</div>
            <button class="directions-btn w-full px-4 py-2 rounded-lg bg-[#669BBC] text-white font-semibold hover:bg-[#242423] transition" 
                    data-lat="${pos.lat()}" 
                    data-lng="${pos.lng()}" 
                    data-address="${data.address}">
                Get Directions
            </button>
        </div> `;
    });
    
    // close the cards grid div
    html += `</div>`;
    cardsContainer.innerHTML = html;
    
    // add click handlers for directions buttons
    setupDirectionsButtons();
}

// function to set up click handlers for direction buttons
function setupDirectionsButtons() {
    const directionButtons = document.querySelectorAll('.directions-btn');
    
    directionButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const destinationLat = parseFloat(btn.dataset.lat);
            const destinationLng = parseFloat(btn.dataset.lng);
            const destinationAddress = btn.dataset.address;
            const destination = new google.maps.LatLng(destinationLat, destinationLng);
            
            // check if we have a stored user location from the search
            const originLat = btn.dataset.originLat;
            const originLng = btn.dataset.originLng;
            const userAddress = document.getElementById('addressInput')?.value.trim();
            
            if (originLat && originLng) {
                // use the stored origin from the search
                const origin = new google.maps.LatLng(parseFloat(originLat), parseFloat(originLng));
                getDirections(origin, destination, destinationAddress);
            } else if (userAddress) {
                // if there's text in the address input, geocode it first
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({ address: userAddress }, (results, status) => {
                    if (status === 'OK') {
                        const origin = results[0].geometry.location;
                        getDirections(origin, destination, destinationAddress);
                    } else {
                        alert('Please enter a valid address first or use "Find Nearest" to search.');
                    }
                });
            } else if (userMarker) {
                // use the user marker position if available
                getDirections(userMarker.getPosition(), destination, destinationAddress);
            } else {
                // prompt for current location
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const origin = new google.maps.LatLng(
                                position.coords.latitude,
                                position.coords.longitude
                            );
                            getDirections(origin, destination, destinationAddress);
                        },
                        () => {
                            alert('Please use "Find Nearest" or "Use Current Location" first to get directions.');
                        }
                    );
                } else {
                    alert('Please use "Find Nearest" or enter an address first to get directions.');
                }
            }
        });
    });
}

// shows the smallest map view that contains every marker
function fitMapToMarkers(markers) {
    if (markers.length === 0) return;
    
    // create a new bounds object to track the area containing all markers
    const bounds = new google.maps.LatLngBounds();
    // loop through each marker
    markers.forEach(marker => {
        // extend the bounds to include this marker's position
        bounds.extend(marker.getPosition());
    });
    
    // adjust the map to fit all markers within view
    map.fitBounds(bounds);
}

function calculateBounds(center, radiusInMiles) {
    const radiusInKm = radiusInMiles * 1.60934;
    
    // calculate latitude and longitude 40075 km circumference / 360 degrees = 111 km per degree
    const latOffset = radiusInKm / 111.0;
    const lngOffset = radiusInKm / (111.0 * Math.cos(center.lat * Math.PI / 180));
    
    return {
        north: center.lat + latOffset,
        south: center.lat - latOffset,
        east: center.lng + lngOffset, 
        west: center.lng - lngOffset
    };
}

// waits for DOM to load before fetching api key 
window.addEventListener('DOMContentLoaded', () => {
    fetch('/mapAPI')
        .then(response => response.json())
        .then(mapAPI => {
            // append google maps script tag with api key to document body
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${mapAPI.googleMapsApiKey}&libraries=geometry&callback=initMap`;
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
        })
        .catch(error => {
            console.error('Error loading API key:', error);
        });
});
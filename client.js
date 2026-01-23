let map;
let userMarker = null;
let allMarkers = [];
let currentMode = 'nearest';

function initMap() {

    // define charlotte coordinates
    const charlotte = { lat: 35.2271, lng: -80.8409 };
    
    // initialize new google map object centered on charlotte, with controls and restrictions
    map = new google.maps.Map(document.getElementById('map'), {
        center: charlotte,
        zoom: 11,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        restriction: {
            latLngBounds: calculateBounds(charlotte, 25),
            strictBounds: true
        }
    });
    
    const geocoder = new google.maps.Geocoder();
    
    // three separate arrays for different label types
    const label1Locations = [
    { address: '500 Spratt St B, Charlotte, NC 28206', title: 'Second Harvest Food Bank of Metrolina', label: '1', type: 'Food Pantry' },
    { address: '901 Carrier Dr, Charlotte, NC 28216', title: 'Nourish Up', label: '1', type: 'Food Pantry' },
    { address: '4100 Johnston Oehler Rd, Charlotte, NC 28269', title: 'Hope Street Food Pantry', label: '1', type: 'Food Pantry' },
    { address: '5232 The Plaza, Charlotte, NC 28215', title: 'Care To Share Outreach Center & Food Pantry', label: '1', type: 'Food Pantry' },
    { address: '4040 Chesapeake Dr, Charlotte, NC 28216', title: 'Hearts and Hands Food Pantry', label: '1', type: 'Food Pantry' },
    { address: '3725 Beatties Ford Rd, Charlotte, NC 28216', title: 'Reeder Memorial Baptist Church Missions Place Food Pantry', label: '1', type: 'Food Pantry' },
    { address: '7424 E W.T. Harris Blvd, Charlotte, NC 28227', title: 'Hickory Grove Food Pantry', label: '1', type: 'Food Pantry' },
    { address: '1224 John Kirk Dr, Charlotte, NC 28262', title: 'Jamil Niner Student Pantry', label: '1', type: 'Food Pantry' },
    { address: '1600 Norris Ave, Charlotte, NC 28206', title: 'Saint Luke Baptist Church Food Pantry', label: '1', type: 'Food Pantry' },
    { address: '1401 Allen St, Charlotte, NC 28205', title: 'Saint Paul Baptist Church Food Distribution Center', label: '1', type: 'Food Pantry' },
    { address: '5415 Airport Dr, Charlotte, NC 28208', title: 'The Harvest Center of Charlotte', label: '1', type: 'Food Pantry' },
    { address: '534 Spratt St, Charlotte, NC 28206', title: 'Salvation Army - Charlotte Food Distribution Center', label: '1', type: 'Food Pantry' }
    ];

    const label2Locations = [
    { address: '5535 Albemarle Rd, Charlotte, NC 28212', title: 'Charlotte Center for Legal Advocacy', label: '2', type: 'Legal Assistance' },
    { address: '1611 E 7th St, Charlotte, NC 28204', title: 'International House', label: '2', type: 'Legal Assistance' },
    { address: '4938 Central Ave #101, Charlotte, NC 28205', title: 'Latin American Coalition', label: '2', type: 'Legal Assistance' },
    { address: '6100 Fairview Rd #1145, Charlotte, NC 28210', title: 'Elizabeth Rosario Law, PLC - Immigration Lawyer', label: '2', type: 'Legal Assistance' },
    { address: '6135 Park S Dr suite 510, Charlotte, NC 28210', title: 'Ify Immigration Law Firm', label: '2', type: 'Legal Assistance' },
    { address: '3117 Whiting Ave, Charlotte, NC 28205', title: 'VíaLegal Immigration', label: '2', type: 'Legal Assistance' },
    { address: '207 Regency Executive Park Dr Ste 120, Charlotte, NC 28217', title: 'Pardo Law Firm, PLLC.', label: '2', type: 'Legal Assistance' },
    { address: '5244 N Sharon Amity Rd, Ste A, Charlotte, NC 28215', title: 'The Gilchrist Law Firm', label: '2', type: 'Legal Assistance' },
    { address: '6100 Fairview Rd, Ste 200, Charlotte, NC 28210', title: 'Garfinkel Immigration Law Firm', label: '2', type: 'Legal Assistance' },
    { address: '6135 Park South Dr, Ste 593, Charlotte, NC 28210', title: 'Powers Immigration Law - Charlotte', label: '2', type: 'Legal Assistance' },
    { address: '10150 Mallard Creek Rd #105, Charlotte, NC 28262', title: 'Law Office of Kelli Y. Allen, PLLC', label: '2', type: 'Legal Assistance' },
    { address: '402 W Trade St #100, Charlotte, NC 28202', title: 'Cauley Forsythe Immigration', label: '2', type: 'Legal Assistance' }
    ];


    const label3Locations = [
    { address: '100 N Tryon St, Charlotte, NC 28202', title: 'Chipotle - Uptown', label: '3', type: 'Chipotle' },
    { address: '1100 Metropolitan Ave, Charlotte, NC 28204', title: 'Chipotle - Midtown', label: '3', type: 'Chipotle' },
    { address: '4221 Providence Rd, Charlotte, NC 28211', title: 'Chipotle - Providence', label: '3', type: 'Chipotle' }
    ];
    
    const allLocations = [...label1Locations, ...label2Locations, ...label3Locations];
    
     // counter to track how many locations have been successfully geocoded
    let geocodedCount = 0;
    // loop through each location in the combined array
    allLocations.forEach(location => {
        // call the geocode method to convert the address to lat/lng coordinates
        geocoder.geocode({ address: location.address }, (results, status) => {
            if (status === 'OK') {
                const marker = new google.maps.Marker({
                    position: results[0].geometry.location,
                    map: map,
                    title: location.title,
                    label: location.label,
                    opacity: 0.5,
                    locationData: {
                        title: location.title,
                        address: location.address,
                        label: location.label,
                        type: location.type,
                        position: results[0].geometry.location
                    }
                });
                
                // add this marker to the global array of all markers
                allMarkers.push(marker);
                
                // create an info window (popup) for this marker
                const infoWindow = new google.maps.InfoWindow({
                    content: `<strong>${location.title}</strong><br>${location.address}<br>Type: ${location.type}`
                });
                
                marker.addListener('click', () => {
                // when marker is clicked, open the info window at the marker's location
                    infoWindow.open(map, marker);
                });
                
                // increment the counter of successfully geocoded locations
                geocodedCount++;
                if (geocodedCount === allLocations.length) {
                    // once all markers are loaded, enable the search functionality and filter buttons functionality
                    setupSearch(geocoder);
                    setupFilters();
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
        // if an address was entered
        if (address) {
            // set the mode to nearest location finding
            currentMode = 'nearest';
            // find and display the nearest markers to this address
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

// function to set up the filter buttons for browsing by category
function setupFilters() {
    // get all elements with the class 'filter-btn' 
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // loop through each filter button
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // get the label from the button's data attribute
            const label = btn.dataset.label;
            currentMode = 'filter';
            
            // remove 'active' class from all filter buttons, re-add 'active' class to the clicked button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // filter and display only locations matching this label
            filterByLabel(label);
        });
    });
    
    
    const showAllBtn = document.getElementById('showAllBtn');
    if (showAllBtn) {
        showAllBtn.addEventListener('click', () => {
            currentMode = 'filter';
            // remove 'active' class from all filter buttons, add 'active' class to the show all button
            filterButtons.forEach(b => b.classList.remove('active'));
            showAllBtn.classList.add('active');

            // display all locations on the map
            showAllLocations();
        });
    }
}

// function to filter and display only locations matching a specific label
function filterByLabel(label) {
    // if user marker exists, remove it from the map
    if (userMarker) {
        userMarker.setMap(null);
        userMarker = null;
    }
    
    // filter the allmarkers array to get only markers with matching label
    const filteredMarkers = allMarkers.filter(m => m.locationData.label === label);
    
    allMarkers.forEach(marker => {
        // show this marker on the mapif this marker's label matches the selected label
        if (marker.locationData.label === label) {
            marker.setMap(map);
            marker.setOpacity(1.0);
        } else {
            marker.setMap(null);
        }
    });
    
    // display markers in the sidebar, adjust the map zoom and center to fit all visible markers
    if(label === '1') type = 'Food Pantries';
    else if(label === '2') type = 'Legal Assistance';
    else if(label === '3') type = 'Other Resources';
    displayCards(filteredMarkers, `Category: ${type} (${label})`);
    fitMapToMarkers(filteredMarkers);
}

// function to show all locations on the map without filtering
function showAllLocations() {

    // if user marker exists, remove it from the map
    if (userMarker) {
        userMarker.setMap(null);
        userMarker = null;
    }
    
    allMarkers.forEach(marker => {
        // show each marker on the map
        marker.setMap(map);
        marker.setOpacity(0.7);
    });
    
    // display all markers as cards in the sidebar, adjust the map zoom and center to fit all visible markers
    displayCards(allMarkers, 'All Locations');
    fitMapToMarkers(allMarkers);
}

// function to find nearest markers from a entered address or user's location
function findNearestMarkers(geocoder, userAddress) {
    // geocode the user's address to get coordinates
    geocoder.geocode({ address: userAddress }, (results, status) => {
        if (status === 'OK') {
            // extract the location coordinates from the first result and find nearest markers
            const userLocation = results[0].geometry.location;
            findNearestMarkersFromCoords(userLocation, userAddress);
        } else {
            alert('Address not found. Please try again with a Charlotte area address.');
        }
    });
}

// function to find nearest markers from coordinates 
function findNearestMarkersFromCoords(userLocation, address = 'Your Location') {
    // show all markers on the map initially
    allMarkers.forEach(marker => {
        marker.setMap(map);
    });
    
    // if old user marker exists, remove it from the map
    if (userMarker) {
        userMarker.setMap(null);
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
    
    // create a blue marker at the user's location
    userMarker = new google.maps.Marker({
        position: userLatLng,
        map: map,
        title: 'Your Location',
        // use blue icon to distinguish from location markers
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    });
    
    // center the map on the user's location
    map.setCenter(userLatLng);
    map.setZoom(12);
    
    // find, highlight, and display the nearest marker and side card of each label type to the user
    const nearest = findNearestByLabel(userLatLng);
    highlightNearestMarkers(nearest);
    displayNearestCards(nearest, address);
}

// finds the nearest marker of each label type to a given location
function findNearestByLabel(userLocation) {
    // create object to store nearest marker for each label 
    const nearest = { '1': null, '2': null, '3': null };
    
    // loop through each label type
    ['1', '2', '3'].forEach(label => {
        let closestMarker = null;
        let closestDistance = Infinity;
        
        // loop through all markers
        allMarkers.forEach(marker => {
            // check if this marker has the current label we're looking for
            if (marker.locationData.label === label) {
                // calculate distance from user location to this marker
                const distance = calculateDistance(userLocation, marker.getPosition());
                
                // check if this distance is shorter than current closest
                if (distance < closestDistance) {
                    // update the closest distance
                    closestDistance = distance;
                    // create object with marker data and distance
                    closestMarker = {
                        title: marker.locationData.title,
                        address: marker.locationData.address,
                        type: marker.locationData.type,
                        distance: distance,
                        marker: marker
                    };
                }
            }
        });
        
        // store the closest marker for this label in the nearest object
        nearest[label] = closestMarker;
    });
    
    return nearest;
}

// function to calculate distance between two coordinates
function calculateDistance(pos1, pos2) {

    const meters = google.maps.geometry.spherical.computeDistanceBetween(pos1, pos2);

  // convert meters to miles
  return meters * 0.000621371;
}

// function to highlight only the nearest markers and hide all others
function highlightNearestMarkers(nearest) {
    // loop through all markers
    allMarkers.forEach(marker => {
        // make all markers semi-transparent
        // marker.setOpacity(0.5);
        // hide all markers
        marker.setMap(null);
        marker.setAnimation(null);
    });
    
    // loop through each label type
    ['1', '2', '3'].forEach(label => {
        // check if a nearest marker was found for this label
        if (nearest[label]) {

            // make this marker fully visible
            nearest[label].marker.setMap(map);
            nearest[label].marker.setOpacity(1.0);

            // make this marker bounce for 1.5 secs
            nearest[label].marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(() => {
                nearest[label].marker.setAnimation(null);
            }, 1500);
        }
    });
}

// function to display the nearest locations as cards in the sidebar
function displayNearestCards(nearest, userAddress) {
    // get the cards container element from html
    const cardsContainer = document.getElementById('cardsContainer');
    // create object mapping label numbers to readable names
    const labelNames = { '1': 'Food Pantry', '2': 'Legal Assistance', '3': 'Other Resources' };
    
    // start building html string with header showing user's address
    let html = `<h3>Nearest to: ${userAddress}</h3><div class="cards-grid">`;
    
    // loop through each label type
    ['1', '2', '3'].forEach(label => {
        // check if a nearest location was found for this label
        if (nearest[label]) {
            // add html for a location card
            html += `
                <div class="location-card">
                    <div class="card-header">${labelNames[label]}</div>
                    <div class="card-title">${nearest[label].title}</div>
                    <div class="card-distance">${nearest[label].distance.toFixed(2)} miles away</div>
                    <div class="card-address">${nearest[label].address}</div>
                </div>
            `;
        }
    });
    
    // close the cards grid div
    html += `</div>`;
    // insert the html into the cards container
    cardsContainer.innerHTML = html;
}

// function to display multiple locations as cards 
function displayCards(markers, title) {
    // get the cards container element from html
    const cardsContainer = document.getElementById('cardsContainer');
    
    // start building html string with title
    let html = `<h3>${title}</h3><div class="cards-grid">`;
    
    // loop through each marker
    markers.forEach(marker => {
        // get the location data from the marker
        const data = marker.locationData;
        // add html for a location card
        html += `
            <div class="location-card">
                <div class="card-header">${data.type}</div>
                <div class="card-title">${data.title}</div>
                <div class="card-address">${data.address}</div>
            </div>
        `;
    });
    
    // close the cards grid div
    html += `</div>`;
    cardsContainer.innerHTML = html;
}

// shows the smallest map view that contains every marker.
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
    const lat = center.lat;
    const lng = center.lng;
    // calculate latitude and longitude 40075 km circumference / 360 degrees = 111 km per degree
    const latOffset = radiusInKm / 111.0;
    const lngOffset = radiusInKm / (111.0 * Math.cos(lat * Math.PI / 180));
    
    return {
        north: lat + latOffset,
        south: lat - latOffset,
        east: lng + lngOffset, 
        west: lng - lngOffset
    };
}

// waits for DOM to load before fetching API key 
window.addEventListener('DOMContentLoaded', () => {
    fetch('/api/config')
        .then(response => response.json())
        .then(config => {
            // append google maps script tag with API key to document body
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${config.googleMapsApiKey}&libraries=geometry&callback=initMap`;
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
        })
        .catch(error => {
            console.error('Error loading API key:', error);
        });
});
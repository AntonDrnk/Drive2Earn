
import { updateMapDashboard, resetMapDashboard } from './ui.js'; 

let map, userMarker, routingControl, watchId;
let totalDistance = 0, lastPosition = null;
let currentRideDetails = {};

const defaultIconHtml = `<div class="pulse-container"></div><div class="user-icon-rotator"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2L2 22l10-6 10 6z" /></svg></div>`;

function saveRideState() {
    const state = {
        totalDistance,
        lastPosition,
        ...currentRideDetails
    };
    localStorage.setItem('rideInProgress', JSON.stringify(state));
}

function clearRideState() {
    localStorage.removeItem('rideInProgress');
}

export function initializeMap() {
    if (map) return map;
    map = L.map('map').setView([50.45, 30.52], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    
    routingControl = L.Routing.control({
        waypoints: [],
        routeWhileDragging: false,
        createMarker: () => null, 
        lineOptions: { styles: [{color: '#00D0FF', opacity: 0.8, weight: 6}] },
        show: false,
        geocoder: L.Control.Geocoder.nominatim()
    }).addTo(map);

    const userIcon = L.divIcon({ className: 'icon-wrapper', html: defaultIconHtml, iconSize: [40, 40], iconAnchor: [20, 40] });
    userMarker = L.marker(map.getCenter(), { icon: userIcon }).addTo(map);
    
    return map;
}

function onLocationUpdate(position) {
    const { earningRate } = currentRideDetails;
    const { latitude, longitude, speed, heading } = position.coords;
    const newLatLng = L.latLng(latitude, longitude);

    // ---> ДОБАВЬТЕ ЭТУ СТРОКУ
    console.log(`[LOCATION UPDATE] Обновление GPS. totalDistance до сложения: ${totalDistance.toFixed(2)}`);


    if (userMarker) userMarker.setLatLng(newLatLng);
    map.setView(newLatLng, 16);

    if (lastPosition) {
        totalDistance += map.distance(lastPosition, newLatLng);
    }
    lastPosition = newLatLng;

    const waypoints = routingControl.getWaypoints();
    if (waypoints && waypoints.length > 0) {
        waypoints[0] = { latLng: newLatLng };
        routingControl.setWaypoints(waypoints);
    }
    
    if (heading !== null) {
        const markerEl = userMarker.getElement();
        if (markerEl) {
            const rotator = markerEl.querySelector('.user-icon-rotator');
            if (rotator) rotator.style.transform = `rotate(${heading}deg)`;
        }
    }

    saveRideState();

    updateMapDashboard({
        speed: speed ? Math.round(speed * 3.6) : '0',
        distance: (totalDistance / 1000).toFixed(2),
        earnings: ((totalDistance / 1000) * earningRate).toFixed(2)
    });
}

export function startRide({userLatLng, destinationLatLng = null, earningRate, vehicleIndex, errorCallback, restoreState = null}) {
    resetMapDashboard(); // Гарантированно сбрасываем UI перед стартом
    currentRideDetails = { earningRate, vehicleIndex, destinationLatLng };

    if (restoreState) {
        totalDistance = restoreState.totalDistance || 0;
        lastPosition = restoreState.lastPosition ? L.latLng(restoreState.lastPosition.lat, restoreState.lastPosition.lng) : userLatLng;
        console.log("Поездка восстановлена. Пройденная дистанция:", totalDistance);
    } else {
        totalDistance = 0;
        lastPosition = userLatLng;
        saveRideState();
    }

    // ---> ДОБАВЬТЕ ЭТУ СТРОКУ
    console.log(`[START RIDE] Новая поездка начинается. totalDistance сейчас: ${totalDistance.toFixed(2)}`);

    
    let waypoints = [userLatLng];
    if (destinationLatLng) {
        waypoints.push(destinationLatLng);
    }
    routingControl.setWaypoints(waypoints);
    
    map.setView(userLatLng, 16);
    
    if (watchId) navigator.geolocation.clearWatch(watchId);
    
    watchId = navigator.geolocation.watchPosition(
        onLocationUpdate,
        errorCallback,
        { enableHighAccuracy: true }
    );
}

export function stopRide() {
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
    clearRideState(); 
    
    routingControl.setWaypoints([]);
    const finalDistance = totalDistance; 
    console.log(`[STOP RIDE] Сбрасываю totalDistance. Было: ${totalDistance.toFixed(2)}`);

    totalDistance = 0; 
    lastPosition = null;
    currentRideDetails = {};
    return finalDistance; 
}
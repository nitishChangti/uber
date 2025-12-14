import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";

const CaptainLiveTracking = ({
  onLocationUpdate,
  pickupCoords,
  destinationCoords,
}) => {
  const mapRef = useRef(null);
  const captainMarkerRef = useRef(null);
  const routeRef = useRef(null);

  // Custom icons
  const pickupIcon = new L.Icon({
    iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png",
    iconSize: [35, 35],
  });

  const destinationIcon = new L.Icon({
    iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png",
    iconSize: [35, 35],
  });

  // Initialize Map
  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = L.map("captain-map", {
      zoom: 16,
      zoomControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 20,
    }).addTo(mapRef.current);

    setTimeout(() => mapRef.current.invalidateSize(), 200);
  }, []);

  // Watch Captain GPS
  useEffect(() => {
    if (!mapRef.current) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const position = [lat, lng];

        onLocationUpdate({ lat, lng });

        // Create or update captain marker
        if (!captainMarkerRef.current) {
          captainMarkerRef.current = L.marker(position).addTo(mapRef.current);
        } else {
          captainMarkerRef.current.setLatLng(position);
        }

        mapRef.current.setView(position, 16);

        // Redraw route whenever captain moves
        drawRoute(position, pickupCoords, destinationCoords);
      },
      (err) => console.log("GPS ERROR:", err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [pickupCoords, destinationCoords]);

  // Draw Route Logic
  const drawRoute = (captainPos, pickUp, dest) => {
    if (!captainPos) return;

    // Remove old route
    if (routeRef.current) {
      mapRef.current.removeControl(routeRef.current);
    }

    const waypoints = [];

    // captain → pickup
    waypoints.push(L.latLng(captainPos[0], captainPos[1]));

    if (pickUp) waypoints.push(L.latLng(pickUp.lat, pickUp.lng));
    if (dest) waypoints.push(L.latLng(dest.lat, dest.lng));

    routeRef.current = L.Routing.control({
      waypoints: waypoints,
      addWaypoints: false,
      routeWhileDragging: false,
      createMarker: () => null,
      lineOptions: { styles: [{ color: "#007bff", weight: 5 }] },
    }).addTo(mapRef.current);

    // Hide Elementor panel
    const panels = document.getElementsByClassName("leaflet-routing-container");
    if (panels.length > 0) panels[0].style.display = "none";
  };

  return <div id="captain-map" className="w-full h-full"></div>;
};

export default CaptainLiveTracking;

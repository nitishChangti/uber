import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const LiveTracking = ({onLocationUpdate}) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [currentPos, setCurrentPos] = useState(null);

  useEffect(() => {
    // Initialize map only once
    mapRef.current = L.map("map", {
      zoom: 16,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 20,
    }).addTo(mapRef.current);

    // Fix resizing blank issue
    setTimeout(() => {
      mapRef.current.invalidateSize();
    }, 300);

    return () => {
      mapRef.current.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Watch user location live
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        const newPos = [latitude, longitude];
        setCurrentPos(newPos);
        onLocationUpdate({
          lat:newPos[0],
          lng:newPos[1]
        });
        // Marker handling
        if (!markerRef.current) {
          markerRef.current = L.marker(newPos).addTo(mapRef.current);
        } else {
          markerRef.current.setLatLng(newPos);
        }

        // Center map to new location
        mapRef.current.setView(newPos, 16);
      },
      (err) => {
        console.log("GPS error:", err);
      },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div id="map" className="w-full h-full"></div>
  );
};

export default LiveTracking;

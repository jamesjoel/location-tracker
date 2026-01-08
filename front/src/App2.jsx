import React, { useEffect, useState } from "react";
import {
  APIProvider,
  Map,
  Marker,
  useMap,
} from "@vis.gl/react-google-maps";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const source = { lat: 28.6139, lng: 77.2090 }; // Delhi
const destination = { lat: 27.1767, lng: 78.0081 }; // Agra

export default function RouteMap() {
  return (
    <APIProvider apiKey="AIzaSyD-vpcc3LQ4s5b7yrEvIG7u0jMHlQL8pzU">
      <Map
        defaultZoom={7}
        defaultCenter={source}
        style={containerStyle}
      >
        <Marker position={source} />
        <Marker position={destination} />
        <Directions source={source} destination={destination} />
      </Map>
    </APIProvider>
  );
}



let Directions = ({ source, destination }) => {
  const map = useMap();
  const [directionsRenderer, setDirectionsRenderer] = useState(null);

  useEffect(() => {
    if (!map) return;

    const service = new google.maps.DirectionsService();
    const renderer = new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true, // we already added custom markers
    });

    setDirectionsRenderer(renderer);

    service.route(
      {
        origin: source,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          renderer.setDirections(result);
        } else {
          console.error("Directions request failed:", status);
        }
      }
    );

    return () => renderer.setMap(null);
  }, [map, source, destination]);

  return null;
}

import React, {useState, useEffect} from 'react'
import {useMap} from '@vis.gl/react-google-maps'

const Directions = ({ source, destination }) => {
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

export default Directions
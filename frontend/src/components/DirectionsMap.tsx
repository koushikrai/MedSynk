import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, DirectionsRenderer } from '@react-google-maps/api';

const MapWithDirections = ({ userLocation, destination }) => {
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchDirections = async () => {
      if (!isLoaded || !userLocation || !destination) return;

      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: userLocation,
          destination,
          travelMode: window.google.maps.TravelMode.DRIVING, // or WALKING, BICYCLING, TRANSIT
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirectionsResponse(result);
          } else {
            console.error(`Error fetching directions: ${status}`);
          }
        }
      );
    };

    fetchDirections();
  }, [isLoaded, userLocation, destination]);

  return (
    <LoadScript
      googleMapsApiKey="GOOGLE_MAPS_API_KEY" // Replace with your API key
      onLoad={() => setIsLoaded(true)}
    >
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '500px' }}
        center={{ lat: 0, lng: 0 }} // Default center
        zoom={10}
      >
        {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapWithDirections;

const NodeCache = require("node-cache");
const axios = require("axios");
const Hospital = require("../models/Hospital"); // Import the Hospital model

const cache = new NodeCache({ stdTTL: 600 }); // Cache items for 10 minutes
const googleMapsAPI = "AIzaSyC-mlH4fJ4Ej4vS6AyCt2PNcWiNnsGMnoY"; // Replace with your actual API key

// Function to geocode an address
async function geocodeAddress(address) {
  const cacheKey = `geocode-${address}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${googleMapsAPI}`;
    const response = await axios.get(url);

    if (response.data.status !== "OK") {
      console.error("Geocoding API Error:", response.data);
      throw new Error(`Geocoding failed: ${response.data.status}`);
    }

    const location = response.data.results[0].geometry.location;
    cache.set(cacheKey, location); // Store result in cache
    return location;
  } catch (error) {
    console.error("Error during geocoding:", error);
    throw new Error("Geocoding request failed");
  }
}

// Function to find nearby hospitals
async function findNearbyHospitals(lat, lng) {
    const cacheKey = `hospitals-${lat}-${lng}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }
  
    try {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=hospital&key=${googleMapsAPI}`;
      const response = await axios.get(url);
  
      if (response.data.status !== "OK") {
        throw new Error(`Places API failed: ${response.data.status}`);
      }
  
      const hospitals = response.data.results;
  
      // Save hospitals to the database
      const savedHospitals = await saveHospitals(hospitals);
  
      // Ensure everything being cached is a plain object
      const plainHospitals = savedHospitals.map(hospital =>
        hospital.toObject ? hospital.toObject() : hospital
      );
      cache.set(cacheKey, plainHospitals);
  
      return plainHospitals;
    } catch (error) {
      console.error("Error finding nearby hospitals:", error);
      throw error;
    }
  }
  

async function saveHospitals(hospitals) {
    const savedHospitals = [];
  
    for (const hospital of hospitals) {
      try {
        let existingHospital = await Hospital.findOne({ placeId: hospital.place_id });
  
        if (!existingHospital) {
          // If the hospital does not exist, create a new one
          const newHospital = new Hospital({
            name: hospital.name,
            address: hospital.vicinity,
            location: {
              lat: hospital.geometry.location.lat,
              lng: hospital.geometry.location.lng,
            },
            placeId: hospital.place_id,
            phone: hospital?.formatted_phone_number || "",
            services: hospital.types || [],
            totalBeds  : Math.floor(Math.random() * (100 - 50 + 1)) + 50,
          });

          existingHospital = await newHospital.save();
        }
  
        // Push the plain object to the array
        savedHospitals.push(existingHospital.toObject ? existingHospital.toObject() : existingHospital);
      } catch (error) {
        console.error("Error saving hospital:", error);
      }
    }
  
    return savedHospitals;
  }
  

// Function to get directions from an origin to a destination
async function getDirections(origin, destinationPlaceId) {
  const cacheKey = `directions-${origin.lat}-${origin.lng}-${destinationPlaceId}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=place_id:${destinationPlaceId}&key=${googleMapsAPI}`;
    const response = await axios.get(url);

    if (response.data.status !== "OK") {
      throw new Error(`Directions API failed: ${response.data.status}`);
    }

    const route = response.data.routes[0];
    cache.set(cacheKey, route); // Store result in cache
    return route;
  } catch (error) {
    console.error("Error getting directions:", error);
    throw error;
  }
}

module.exports = { geocodeAddress, findNearbyHospitals, saveHospitals, getDirections };

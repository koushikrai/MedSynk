const RequestSchema = require("../models/Request");
const {
  geocodeAddress,
  findNearbyHospitals,
  getDirections,
} = require("../services/googleMapsService");

async function handleEmergency(req, res, next) {
  const { address, details, userId, name, age } = req.body;
  if (!address || !details) {
    return res
      .status(400)
      .json({ message: "Address and details are required." });
  }

  try {
    // Step 1: Geocode the address
    const location = await geocodeAddress(address);
    // Step 2: Find nearby hospitals
    const hospitals = await findNearbyHospitals(location.lat, location.lng);
    if (hospitals.length === 0) {
      return res.status(404).json({ message: "No hospitals found nearby." });
    }
    const nearestHospital = hospitals[0];
    // Step 3: Get directions to the nearest hospital
    const route = await getDirections(location, nearestHospital.placeId);

    const newRequest = new RequestSchema({
      emergencyDetails: { address, details },
      emergencyLocation: location,
      nearestHospital: {
        name: nearestHospital.name,
        address: nearestHospital.address,
        location: nearestHospital.location,
        placeId : nearestHospital.placeId
      },
      route,
      userId,
      additionalNote: details,
      patientName: name,
      patientAge: age,
    });

    requestObj = await newRequest.save();

    // Step 4: Respond with all information
    res.json({
      message: "Emergency request successfully handled.",
      requestId: requestObj._id, // Access the saved document's ID
    });
  } catch (error) {
    console.error(error);
    next(error); // Pass errors to the global error handler
  }
}

module.exports = { handleEmergency };

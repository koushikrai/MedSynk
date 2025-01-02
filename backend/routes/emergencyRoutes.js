const express = require("express");
const { handleEmergency } = require("../controllers/emergencyController");
const RequestSchema = require("../models/Request");
const Hospital = require("../models/Hospital");

const router = express.Router();

// Route to handle emergencies
router.post("/request", handleEmergency);

// Route to get request details by ID
router.get("/request/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    // Fetch the request details by ID
    const request = await RequestSchema.findById(id);

    if (!request) {
      return res.status(404).json({ message: "Request not found." });
    }

    // Respond with the request details
    res.json({
      message: "Request details fetched successfully.",
      data: request,
    });
  } catch (error) {
    console.error("Error fetching request:", error);

    // Handle invalid ID format (e.g., non-ObjectId)
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid request ID format." });
    }

    next(error); // Pass other errors to the global error handler
  }
});

router.get("/hospital", async (req, res, next) => {
  const { placeId } = req.query;
  console.log(req.params, req.query);
  if (!placeId) {
    return res.status(400).json({ message: "placeId is required." });
  }

  try {
    // Find hospital by placeId
    const hospital = await Hospital.findOne({ placeId });

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found." });
    }

    // Respond with hospital details
    res.json({
      message: "Hospital details fetched successfully.",
      data: hospital,
    });
  } catch (error) {
    console.error("Error fetching hospital details:", error.message);
    next(error); // Pass errors to the global error handler
  }
});

router.get("/requests", async (req, res, next) => {
  try {
    const requests = await RequestSchema.find(); // Fetch all requests
    res.status(200).json({
      message: "All request details fetched successfully.",
      data: requests,
    });
  } catch (error) {
    console.error("Error fetching requests:", error);
    next(error); // Pass the error to the global error handler
  }
});

// Route to update request data using POST
router.post("/update-request/:id", async (req, res, next) => {
  const requestId = req.params.id; // Get the request ID from the URL
  const { medicalCondition, bedNumber, initialNotes, placeId } = req.body; // New data from the request body

  try {
    // Find the request by ID and update it with new data
    // Step 1: Check if the bedNumber is already assigned
    const existingBeds = await RequestSchema.find();
    let existingBed = false;

    existingBeds.forEach((bed) => {
      if (bed.nearestHospital.placeId === placeId && bed.bed === bedNumber) {
        existingBed = true;
      }
    });

    if (existingBed) {
      return res
        .status(400)
        .json({ message: `Bed number ${bedNumber} is already assigned.` });
    }
    const updatedRequest = await RequestSchema.findByIdAndUpdate(
      requestId, // The ID of the request to update
      {
        $set: {
          medicalCondition,
          bed: bedNumber,
          initialNotes,
        },
      },
      { new: true } // Return the updated document
    );

    // If no request was found
    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found." });
    }

    // Send the updated request data back to the client
    res.json({
      message: "Request updated successfully",
      updatedRequest,
    });
  } catch (error) {
    console.error(error);
    next(error); // Pass errors to the global error handler
  }
});

router.post("/discharge/:id", async (req, res, next) => {
  const requestId = req.params.id; // Get the request ID from the URL

  try {
    const updatedRequest = await RequestSchema.findByIdAndUpdate(
      requestId, // The ID of the request to update
      {
        $set: {
          bed: null,
          discharged: true,
        },
      },
      { new: true } // Return the updated document
    );

    // If no request was found
    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found." });
    }

    // Send the updated request data back to the client
    res.json({
      message: "Request updated successfully",
      updatedRequest,
    });
  } catch (error) {
    console.error(error);
    next(error); // Pass errors to the global error handler
  }
});
module.exports = router;

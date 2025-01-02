const mongoose = require("mongoose");

// Define the schema for hospitals
const requestSchema = new mongoose.Schema(
  {},
  { strict: false, timestamps: true }
);

// Create and export the model
const RequestSchema = mongoose.model("Requests", requestSchema);

module.exports = RequestSchema;

import React, { useEffect, useState } from "react";
import { PatientStatusCard } from "../components/PatientStatusCard";
import axios from "axios";

// Mock data with additional fields

export default function PatientStatus() {
  const [requestData, setRequestData] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:3001/api/emergency/requests").then((res) => {
      setRequestData(
        res.data.data.map((data) => ({
          id: data._id,
          name: data.patientName,
          age: data.patientAge,
          condition: data?.medicalCondition || "",
          location: data?.emergencyDetails.address,
          status: data?.bed ? "Admitted" : "Not Admitted",
          timestamp: new Date(data.createdAt),
          bedNumber: data?.bed || "Not Assigned",
          hospitalName: data?.nearestHospital.name,
          notes: data?.initialNotes || "",
          initialNotes : data?.additionalNote || ""
        }))
      );
    });
  }, []);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Patient Status Tracking
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {requestData.map((patient) => (
          <PatientStatusCard key={patient.id} patient={patient} />
        ))}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import {
  Bed as BedIcon,
  User,
  Clock,
  LocateIcon,
  Clipboard,
  Building,
} from "lucide-react";
import BedAssignmentModal from "../components/BedAssignmentModal";
import axios from "axios";

const mockBeds = [
  { id: "1", number: "A101", type: "general", status: "available" },
  {
    id: "2",
    number: "A102",
    type: "icu",
    status: "occupied",
    patientName: "John Doe",
  },
  { id: "3", number: "B101", type: "emergency", status: "available" },
  {
    id: "4",
    number: "B102",
    type: "general",
    status: "occupied",
    patientName: "Jane Smith",
  },
];

export default function HospitalManagement() {
  const [selectedWard, setSelectedWard] = useState("all");
  const [requestDatas, setRequestDatas] = useState([]);
  const [flag, setFlag] = useState(false);
  const [error, setError] = useState("");
  const [selectedBed, setSelectedBed] = useState<{
    id: string;
    hospital: string;
  } | null>(null);

  const handleAssignBed = (data: any) => {
    // In a real app, this would update the database
    axios
      .post(
        `http://localhost:3001/api/emergency/update-request/${selectedBed?.id}`,
        {
          medicalCondition: data.condition,
          bedNumber: data.bed,
          initialNotes: data.notes,
          placeId: selectedBed?.hospital,
        }
      )
      .then(() => {
        setSelectedBed(null);
        setFlag((prev) => !prev);
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  };

  useEffect(() => {
    axios.get("http://localhost:3001/api/emergency/requests").then((res) => {
      setRequestDatas(res.data.data);
    });
  }, [flag]);

  const handleDischarge = (requestId) => {
    axios
      .post(`http://localhost:3001/api/emergency/discharge/${requestId}`)
      .then(() => {
        setSelectedBed(null);
        setFlag((prev) => !prev);
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Bed Management</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {requestDatas.map((bed) => (
            <div
              key={bed._id}
              className={`p-4 rounded-lg border ${
                !bed?.bed
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                {bed?.bed && (
                  <div className="flex items-center">
                    <BedIcon
                      className={`w-5 h-5 ${
                        !bed?.bed ? "text-green-600" : "text-red-600"
                      }`}
                    />
                    <span className="ml-2 font-semibold">{bed.bed}</span>
                  </div>
                )}
                <span
                  className={`text-sm px-2 py-1 rounded-full ${
                    !bed?.bed
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {bed?.discharged
                    ? "Discharged"
                    : !bed?.bed
                    ? "Not Assigned"
                    : "Assigned"}
                </span>
              </div>

              <div className="space-y-1">
                <>
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-1" />
                    {bed.patientName} - {bed.patientAge}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <LocateIcon className="w-4 h-4 mr-1" />
                    {bed.emergencyDetails.address}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="w-4 h-4 mr-1" />
                    {bed.nearestHospital.name}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clipboard className="w-4 h-4 mr-1" />
                    initial Note : {bed.additionalNote}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clipboard className="w-4 h-4 mr-1" />
                    Doc Note : {bed.initialNotes}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(bed.createdAt).toLocaleString()}
                  </div>
                </>
              </div>

              <button
                onClick={() => {
                  if (!bed?.bed) {
                    setSelectedBed({
                      id: bed._id,
                      hospital: bed.nearestHospital.placeId,
                    })
                  }else{
                    console.log("here")
                    handleDischarge(bed._id)
                  }
                }}
                disabled={ bed?.discharged}
                className={`mt-3 w-full py-2 px-4 rounded-md text-sm font-medium ${
                  !bed?.bed
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {bed?.discharged
                  ? "Discharged"
                  : !bed?.bed
                  ? "Assign Bed"
                  : "Discharge"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedBed && (
        <BedAssignmentModal
          error={error}
          bedId={selectedBed.id}
          bedNumber={selectedBed.number}
          onClose={() => setSelectedBed(null)}
          onAssign={handleAssignBed}
        />
      )}
    </div>
  );
}

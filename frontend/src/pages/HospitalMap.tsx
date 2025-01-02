import React, { useEffect, useState } from "react";
import { MapPin, Phone, Bed } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import MapWithDirections from "@/components/DirectionsMap";
const mockHospitals = [
  {
    id: "1",
    name: "Central Hospital",
    location: "123 Healthcare Ave",
    availableBeds: 15,
    totalBeds: 50,
    distance: "2.5 km",
    specialties: ["Emergency", "Trauma", "ICU"],
  },
  {
    id: "2",
    name: "City Medical Center",
    location: "456 Medical Blvd",
    availableBeds: 8,
    totalBeds: 40,
    distance: "3.8 km",
    specialties: ["Cardiac", "Emergency", "ICU"],
  },
];

export default function HospitalMap() {
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get("id");
  const [requestData, setRequestData] = useState(null);
  const [hospitalData, setHospitalData] = useState(null);
  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/emergency/request/${requestId}`)
      .then((res) => {
        setRequestData(res.data.data);
        axios
          .get(
            `http://localhost:3001/api/emergency/hospital?placeId=${res.data.data.nearestHospital.placeId}`
          )
          .then((res_) => {
            console.log(res.data.data, res_.data.data);
            setHospitalData(res_.data.data);
          });
      });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-white rounded-lg shadow-sm p-4 h-[600px]">
        <div className="h-full bg-gray-100 rounded flex items-center justify-center">
          {requestData && (
            <MapWithDirections
              userLocation={requestData.emergencyLocation}
              destination={requestData.nearestHospital.location}
            />
          )}
        </div>
      </div>

      {hospitalData && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Nearby Hospitals
          </h2>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-lg text-gray-900">
              {hospitalData?.name}
            </h3>

            <div className="mt-2 space-y-2">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{hospitalData?.address}</span>
              </div>

              <div className="flex items-center text-gray-600">
                <Bed className="w-4 h-4 mr-2" />
                <span>{hospitalData?.totalBeds} beds available</span>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {hospitalData.services.map((specialty) => (
                  <span
                    key={specialty}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React from "react";
import { format } from "date-fns";
import { User, Clock, MapPin, Activity, Bed } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface PatientStatusCardProps {
  patient: {
    id: string;
    name: string;
    age: number;
    condition: string;
    location: string;
    status: string;
    timestamp: Date;
    bedNumber?: string;
    hospitalName?: string;
    notes?: string;
    initialNotes?: string;
  };
}

export function PatientStatusCard({ patient }: PatientStatusCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "assigned":
        return "bg-blue-100 text-blue-800";
      case "admitted":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{patient.name}</CardTitle>
        <Badge className={getStatusColor(patient.status)}>
          {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Age: {patient.age}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{patient.condition}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{patient.location}</span>
            </div>

            {patient.bedNumber && patient.hospitalName && (
              <div className="flex items-center space-x-2">
                <Bed className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Bed {patient.bedNumber} at {patient.hospitalName}
                </span>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {format(patient.timestamp, "MMM d, yyyy HH:mm")}
              </span>
            </div>
          </div>
          {patient.initialNotes && (
            <div className="border-t pt-2">
              <p className="text-sm text-muted-foreground">
                {patient.initialNotes}
              </p>
            </div>
          )}
          {patient.notes && (
            <div className="border-t pt-2">
              <p className="text-sm text-muted-foreground">{patient.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

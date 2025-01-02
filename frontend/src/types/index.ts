export interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  location: string;
  status: 'pending' | 'assigned' | 'admitted';
  timestamp: Date;
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
  totalBeds: number;
  availableBeds: number;
  specialties: string[];
}

export interface Bed {
  id: string;
  number: string;
  type: 'general' | 'icu' | 'emergency';
  status: 'available' | 'occupied';
  patientId?: string;
}
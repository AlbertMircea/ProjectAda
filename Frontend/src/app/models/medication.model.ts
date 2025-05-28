import { Patient } from "./pacient.model";


export interface PatientComplete extends Patient {
  medicationId: number;
  medication: string;
  dosage: string;
  quantity: number;
}

export interface Medication {
  medicationId: number;
  userId: number;
  medication: string;
  dosage: string;
  quantity: number;
}
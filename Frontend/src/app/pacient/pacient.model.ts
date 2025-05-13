export interface Patient {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    active: boolean;
    doctorID: number;
    ward: string;
    room: string;

  }
  
  export interface NewMedication  {
    userId: 0,
    medicationId: 0,
    medication: '',
    dosage: '',
    quantity: 0
  };
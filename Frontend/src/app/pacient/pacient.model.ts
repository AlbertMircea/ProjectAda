export interface Patient {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    active: boolean;
    jobTitle: string;
    department: string;
    salary: number;
    avgSalary: number;
  }
  
  export interface NewMedication  {
    name: '',
    dosage: '',
    frequency: ''
  };
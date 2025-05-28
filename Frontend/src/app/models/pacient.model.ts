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

export interface CustomTokenPayload {
  userId: string;
  exp: number;
  iat: number;
  nbf: number;
}
export interface User {
  userId: number;
  email: string;
  password: string;
  passwordConfirm: string;
  firstName: string;
  lastName: string;
  gender: string;
  roleWorker: string;
}

import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CustomTokenPayload,
  Patient,
  Prescription,
  User,
} from './pacient.model';
import jwt_decode, { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private apiUrlGetAllActivePatients =
    'https://aleznauerdtc1.azurewebsites.net/PatientComplete/GetPatients/0/true';

  private apiUrlUpsertPatient =
    'https://aleznauerdtc1.azurewebsites.net/PatientComplete/UpsertPatient';

  private apiUrlGetUsers =
    'https://aleznauerdtc1.azurewebsites.net/Auth/GetAuthenticatedUsers';

  private apiUrlUpsertMedication =
    'https://aleznauerdtc1.azurewebsites.net/Prescription/UpsertMedication';

  private apiUrlDeletePatient =
    'https://aleznauerdtc1.azurewebsites.net/PatientComplete/PatientDelete/';

  constructor(private http: HttpClient) {}

  getPatients(): Observable<Patient[]> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Patient[]>(this.apiUrlGetAllActivePatients, {
      headers,
    });
  }

  upsertPatient(patient: Patient): Observable<void> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<void>(this.apiUrlUpsertPatient, patient, { headers });
  }

  upsertMedication(medication: Prescription): Observable<void> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<void>(this.apiUrlUpsertMedication, medication, {
      headers,
    });
  }

  deletePatient(userId: number): Observable<void> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<void>(`${this.apiUrlDeletePatient}/${userId}`, {
      headers,
    });
  }

  capitalizeFirstLetter(value: string): string {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

  getUserIdFromToken(): number {
    const token = localStorage.getItem('authToken');

    if (token) {
      const decoded = jwtDecode<CustomTokenPayload>(token);
      if (token) {
        try {
          const decoded = jwtDecode<CustomTokenPayload>(token);
          return Number(decoded.userId);
        } catch (error) {
          console.error('Error decoding token:', error);
          return 0;
        }
      } else {
        console.error('No token found');
      }
    }
    return 0;
  }

  getRoleWorkerOfLoggedInUser() {
    const userId = this.getUserIdFromToken();
    if (!userId) {
      console.error('No userId found in token');
      return;
    }

    this.http.get<User[]>(this.apiUrlGetUsers).subscribe(
      (users) => {
        const foundUser = users.find((u) => u.userId === userId);
        if (foundUser) {
          localStorage.setItem('role', foundUser.roleWorker);
        } else {
          console.warn('User not found');
        }
      },
      (err) => {
        console.error('Failed to fetch users', err);
      }
    );
  }
}

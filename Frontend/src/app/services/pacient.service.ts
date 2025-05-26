import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { CustomTokenPayload, Patient, User } from '../models/pacient.model';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private apiUrlGetAllActivePatients =
    'https://aleznauerdtc2.azurewebsites.net/PatientComplete/GetPatients/{userid}/true';

  private apiUrlUpsertPatient =
    'https://aleznauerdtc2.azurewebsites.net/PatientComplete/UpsertPatient';

  private apiUrlGetUsers =
    'https://aleznauerdtc2.azurewebsites.net/Auth/GetAuthenticatedUsers';

  private apiUrlGetUser =
    'https://aleznauerdtc2.azurewebsites.net/Auth/GetUser/{userid}';

  private apiUrlDeletePatient =
    'https://aleznauerdtc2.azurewebsites.net/PatientComplete/PatientDelete/';

  private apiAuthLogin = 'https://aleznauerdtc2.azurewebsites.net/Auth/Login';

  private registerUrl = 'https://aleznauerdtc2.azurewebsites.net/Auth/Register';

  private getPatient = 'https://aleznauerdtc2.azurewebsites.net/PatientComplete/GetPatient/{userid}'

  constructor(private http: HttpClient) {}

  getApiAuthLogin() {
    return this.apiAuthLogin;
  }

  getApiAuthRegister() {
    return this.registerUrl;
  }

  getPatientsByID(userId: string): Observable<Patient> {
    const url = this.getPatient.replace('{userid}', userId);
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Patient>(url, {
      headers,
    });

  } 
  
  getUserByID(userId: string): Observable<User> {
    const url = this.apiUrlGetUser.replace('{userid}', userId);
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<User>(url, {
      headers,
    });
  }

  getAllPatients(): Observable<Patient[]> {
    const url = this.apiUrlGetAllActivePatients.replace('{userid}', '0');
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Patient[]>(url, {
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

  makeNiceUsername(username: string) {
    if (username.includes('@')) {
      const index = username.indexOf('@');
      username = this.capitalizeFirstLetter(username);
      username = ' ' + username.slice(0, index);
    } else {
      username = this.capitalizeFirstLetter(username);
      username = ' ' + username;
    }
    return username;
  }

  getUserIdFromToken(): number {
    const token = localStorage.getItem('authToken');

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
    return 0;
  }

getUserIdLoggedInUserAndSetRole(): Observable<number | undefined> {
  const userId = this.getUserIdFromToken();
  if (!userId) {
    console.error('No userId found in token');
    return of(undefined);
  }

  return this.http.get<User[]>(this.apiUrlGetUsers).pipe(
    map((users) => {
      const foundUser = users.find((u) => u.userId === userId);
      if (foundUser) {
        localStorage.setItem('role', foundUser.roleWorker);
        return foundUser.userId;
      } else {
        console.warn('User not found');
        return undefined;
      }
    }),
    catchError((err) => {
      console.error('Failed to fetch users', err);
      return of(undefined);
    })
  );
}
}

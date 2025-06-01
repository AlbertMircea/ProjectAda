import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { CustomTokenPayload, Patient, User } from '../models/pacient.model';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class PatientService {

  private baseUrlPatientComplete = 'https://aleznauerdtc2.azurewebsites.net/PatientComplete/';
  private baseUrlAuth =  'https://aleznauerdtc2.azurewebsites.net/Auth/';

  constructor(private http: HttpClient) {}

  getApiAuthLogin() {
    return this.baseUrlAuth + 'Login';
  }

  getApiAuthRegister() {
    return this.baseUrlAuth + 'Register';
  }

  getPatientsByID(userId: string): Observable<Patient> {
    const url = this.baseUrlPatientComplete + 'GetPatient/' + userId.toString();
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Patient>(url, {
      headers,
    });
  }

  getUserByID(userId: string): Observable<User> {
    const url = this.baseUrlAuth + 'GetUser/' + userId.toString();
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<User>(url, {
      headers,
    });
  }

  getAllDoctors(): Observable<User[]> {
    const url = this.baseUrlAuth + 'GetAuthenticatedUsers';
    return this.http
      .get<User[]>(url)
      .pipe(
        map((users) => users.filter((user) => user.roleWorker === 'Doctor'))
      );
  }

  getAllPatients(): Observable<Patient[]> {
    const url = this.baseUrlPatientComplete + 'GetPatients/0/true'
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Patient[]>(url, {
      headers,
    });
  }

  upsertPatient(patient: Patient): Observable<void> {
    const url = this.baseUrlPatientComplete + 'UpsertPatient';
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<void>(url, patient, { headers });
  }

  deletePatient(userId: number): Observable<void> {
    const url = this.baseUrlPatientComplete + 'PatientDelete/' + userId.toString();
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<void>(url, {
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
    const url = this.baseUrlAuth + 'GetAuthenticatedUsers'
    const userId = this.getUserIdFromToken();
    if (!userId) {
      console.error('No userId found in token');
      return of(undefined);
    }

    return this.http.get<User[]>(url).pipe(
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

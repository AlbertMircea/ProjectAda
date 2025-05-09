import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from './pacient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = 'https://aleznauerdtc1.azurewebsites.net/UserComplete/GetUsers/0/false'; 

  constructor(private http: HttpClient) {}
  isFetching = signal(false);

  getPatients(): Observable<Patient[]> {
    this.isFetching.set(true);
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    this.isFetching.set(false);
    return this.http.get<Patient[]>(this.apiUrl, { headers });
  }
}

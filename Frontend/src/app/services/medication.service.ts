import { Injectable, Input, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medication, PatientComplete } from '../models/medication.model';

@Injectable({
  providedIn: 'root',
})
export class MedicationService {
  private apiUrlUpsertMedication =
    'https://aleznauerdtc1.azurewebsites.net/Prescription/UpsertMedication';

  private apiUrlPatientComplete =
    'https://aleznauerdtc1.azurewebsites.net/PatientComplete';

  private apiUrlDeleteMedication =
    'https://aleznauerdtc1.azurewebsites.net/Prescription/MedicationDelete/';

  constructor(private http: HttpClient) {}

  upsertMedication(medication: Medication): Observable<void> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<void>(this.apiUrlUpsertMedication, medication, {
      headers,
    });
  }

  deleteMedication(medicationId: number): Observable<void> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<void>(
      `${this.apiUrlDeleteMedication}/${medicationId}`,
      {
        headers,
      }
    );
  }

  getPatientComplete(
    userId: string,
    isActive: boolean = true
  ): Observable<PatientComplete[]> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<PatientComplete[]>(
      `${this.apiUrlPatientComplete}/GetPatients/${userId}/${isActive}`,
      { headers }
    );
  }
}

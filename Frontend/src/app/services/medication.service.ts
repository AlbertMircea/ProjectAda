import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medication, PatientComplete } from '../models/medication.model';

@Injectable({
  providedIn: 'root',
})
export class MedicationService {

  private baseUrlPrescription = 'https://aleznauerdtc2.azurewebsites.net/Prescription/';
  private baseUrlPatientComplete = 'https://aleznauerdtc2.azurewebsites.net/PatientComplete/';

  constructor(private http: HttpClient) {}

  upsertMedication(medication: Medication): Observable<void> {
    const apiUrlUpsertMedication = this.baseUrlPrescription + 'UpsertMedication';
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<void>(apiUrlUpsertMedication, medication, {
      headers,
    });
  }

  deleteMedication(medicationId: number): Observable<void> {
    const apiUrlDeleteMedication = this.baseUrlPrescription + 'MedicationDelete';
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<void>(
      `${apiUrlDeleteMedication}/${medicationId}`,
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
      `${this.baseUrlPatientComplete}GetPatients/${userId}/${isActive}`,
      { headers }
    );
  }
  
  getPatientByMedicationId(medicationId: string): Observable<Medication[]> {
    const apiUrlGetMedication = this.baseUrlPrescription + 'GetMedicationByMedicationId';
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<Medication[]>(
      `${apiUrlGetMedication}/${medicationId}`,
      { headers }
    );
  }
}

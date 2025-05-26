import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MedicationRequest {
  requestId: number;
  patientId: number;
  nurseId: number;
  medicationId: number;
  status: string;
  quantity: number;
  patientName: string;
  nurseName: string;
  medicationName: string;
  requestedAt: Date;
}

@Injectable({ providedIn: 'root' })
export class MedicationRequestService {
  private baseUrl = 'https://aleznauerdtc2.azurewebsites.net/Prescription'; 

  constructor(private http: HttpClient) {}

  getAllMedicationRequests(): Observable<MedicationRequest[]> {
    const token = localStorage.getItem('authToken');
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
        return this.http.get<MedicationRequest[]>(`${this.baseUrl}/GetAllMedicationRequests`,{ headers });
  }
    deleteRequestMedication(requestId: number): Observable<void> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<void>(`${this.baseUrl}/MedicationRequestDelete/${requestId}`,{ headers });
  }
}

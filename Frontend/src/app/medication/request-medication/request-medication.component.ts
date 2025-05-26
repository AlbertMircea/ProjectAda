import { Component, OnInit } from '@angular/core';
import {
  MedicationRequest,
  MedicationRequestService,
} from '../../services/medication-request.service';
import { HeaderComponent } from '../../header/header.component';
import { PatientService } from '../../services/pacient.service';
import { MedicationService } from '../../services/medication.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-request-medication',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './request-medication.component.html',
  styleUrl: './request-medication.component.css',
})
export class RequestMedicationComponent implements OnInit {
  requests: MedicationRequest[] = [];
  username = '';

  patientMap = new Map<number, string>();
  nurseMap = new Map<number, string>();
  medicationMap = new Map<number, string>();

  constructor(
    private requestService: MedicationRequestService,
    protected patientService: PatientService,
    protected medicationService: MedicationService
  ) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username') ?? 'User';
    this.username = this.patientService.makeNiceUsername(this.username);
    this.refreshRequests();
  }

  refreshRequests() {
    this.requestService.getAllMedicationRequests().subscribe((data) => {
      this.requests = data.map((r) => ({
        ...r,
        requestedAt: new Date(r.requestedAt),
      }));
      this.refreshRequests();
    });

    this.requests.forEach((request) => {
      if (this.patientMap.has(request.patientId)) {
        request.patientName = this.patientMap.get(request.patientId)!;
      } else {
        this.patientService
          .getPatientsByID(request.patientId.toString())
          .subscribe((patient) => {
            const fullName = `${patient.firstName} ${patient.lastName}`;
            this.patientMap.set(request.patientId, fullName);
            request.patientName = fullName;
          });
      }

      if (this.nurseMap.has(request.nurseId)) {
        request.nurseName = this.nurseMap.get(request.nurseId)!;
      } else {
        this.patientService
          .getUserByID(request.nurseId.toString())
          .subscribe((user) => {
            const fullName = `${user.firstName} ${user.lastName}`;
            this.nurseMap.set(request.nurseId, fullName);
            request.nurseName = fullName;
          });
      }

      if (this.medicationMap.has(request.medicationId)) {
        request.medicationName = this.medicationMap.get(request.medicationId)!;
      } else {
        this.medicationService
          .getPatientByMedicationId(request.medicationId.toString())
          .subscribe((prescriptionArr) => {
            if (prescriptionArr && prescriptionArr.length > 0) {
              const med = prescriptionArr[0];
              const medName = `${med.medication} ${med.dosage}`;
              this.medicationMap.set(request.medicationId, medName);
              request.medicationName = medName;
            }
          });
      }
    });
  }

  denyRequest(request: MedicationRequest) {
    this.requestService.deleteRequestMedication(request.requestId).subscribe({
      next: () => {
        console.log('Request Denied!');
        this.refreshRequests();
      },
      error: (error) => {
        console.error('Error deleting request:', error);
        alert('Failed to deny request');
      },
    });
  }

  approveRequest(request: MedicationRequest) {
    console.log('Approving:', request);
    // to do
  }
}

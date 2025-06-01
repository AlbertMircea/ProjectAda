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

  role = '';

  constructor(
    private requestService: MedicationRequestService,
    protected patientService: PatientService,
    protected medicationService: MedicationService
  ) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('role') ?? 'No Role';
    this.username = localStorage.getItem('username') ?? 'User';
    this.username = this.patientService.makeNiceUsername(this.username);
    this.refreshRequests();
  }

refreshRequests() {
  this.requestService.getAllMedicationRequests().subscribe((data) => {
    this.requests = data
      .map((r) => ({
        ...r,
        requestedAt: new Date(r.requestedAt),
      }))
      .sort((a, b) => {
        // Move 'Delivered' to the bottom
        if (a.status === 'Delivered' && b.status !== 'Delivered') return 1;
        if (a.status !== 'Delivered' && b.status === 'Delivered') return -1;
        return 0;
      });

            this.refreshRequests();
    // Populate display names
    this.requests.forEach((request) => {
      if (!this.patientMap.has(request.patientId)) {
        this.patientService
          .getPatientsByID(request.patientId.toString())
          .subscribe((patient) => {
            const fullName = `${patient.firstName} ${patient.lastName}`;
            this.patientMap.set(request.patientId, fullName);
            request.patientName = fullName;
          });
      } else {
        request.patientName = this.patientMap.get(request.patientId)!;
      }

      if (!this.nurseMap.has(request.nurseId)) {
        this.patientService
          .getUserByID(request.nurseId.toString())
          .subscribe((user) => {
            const fullName = `${user.firstName} ${user.lastName}`;
            this.nurseMap.set(request.nurseId, fullName);
            request.nurseName = fullName;
          });
      } else {
        request.nurseName = this.nurseMap.get(request.nurseId)!;
      }

      if (!this.medicationMap.has(request.medicationId)) {
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
      } else {
        request.medicationName = this.medicationMap.get(request.medicationId)!;
      }
    });
  });
}


  denyRequest(request: MedicationRequest) {
    if (
      confirm(
        `Are you sure you want to deny request of ${request.medicationName} for ${request.patientName}?`
      )
    ) {
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
  }
  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'orange';
      case 'transporting':
        return 'lightblue';
      case 'delivered':
        return 'lightgreen';
      default:
        return 'gray';
    }
  }

  approveRequest(request: MedicationRequest) {
    this.requestService
      .updateStatus(request.requestId, 'Transporting')
      .subscribe(() => {
        this.refreshRequests();
        // // Simulate transport delay
        // setTimeout(() => {
        //   this.requestService
        //     .updateStatus(request.requestId, 'Delivered')
        //     .subscribe(() => {
        //       console.log('Transport complete');
        //     });
        // }, 3000); // 3 seconds delay for simulation
      });
  }
}

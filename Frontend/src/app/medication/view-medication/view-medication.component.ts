import { Component, signal } from '@angular/core';
import { Patient } from '../../models/pacient.model';
import { Medication } from '../../models/medication.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicationService } from '../../services/medication.service';
import { PatientService } from '../../services/pacient.service';
import { HeaderComponent } from '../../header/header.component';
import { EditMedicationComponent } from '../edit-medication/edit-medication.component';
import { ChatModalComponent } from '../chat-modal/chat-modal.component';

@Component({
  selector: 'app-view-medication',
  standalone: true,
  imports: [HeaderComponent, EditMedicationComponent, ChatModalComponent],
  templateUrl: './view-medication.component.html',
  styleUrl: './view-medication.component.css',
})
export class ViewMedicationComponent {
  userId!: string;
  listEmpty = signal(false);
  username = '';

  editingMeds: any = null;
  addMeds = false;
  roleOfTheLoggedUser = signal<string>('No role');

  chatModalVisible = false;

  newMeds: Medication = {
    userId: 0,
    medicationId: 0,
    medication: '',
    dosage: '',
    quantity: 0,
  };

  patient: Patient = {
    userId: 0,
    email: '',
    firstName: '',
    lastName: '',
    gender: '',
    active: true,
    doctorID: this.patientService.getUserIdFromToken(),
    ward: '',
    room: '',
    doctorName: ''
  };

  medications: Medication[] = [];
  constructor(
    private route: ActivatedRoute,
    private medicationService: MedicationService,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId')!;
    this.username = localStorage.getItem('username') ?? 'User';
    this.username = this.patientService.makeNiceUsername(this.username);
    this.loadPatientWithMedications();
    this.roleOfTheLoggedUser.set(localStorage.getItem('role') ?? 'No role');
  }

  loadPatientWithMedications() {
    this.medicationService.getPatientComplete(this.userId).subscribe((data) => {
      if (data.length === 0) {
        console.error('No data returned');
        return;
      }

      const firstRow = data[0];

      this.patient = {
        userId: firstRow.userId,
        firstName: firstRow.firstName,
        lastName: firstRow.lastName,
        email: firstRow.email,
        gender: firstRow.gender,
        active: firstRow.active,
        doctorID: firstRow.doctorID,
        ward: firstRow.ward,
        room: firstRow.room,
        doctorName: ''
      };

      this.medications = data
        .filter((row) => row.medicationId !== null)
        .map((row) => ({
          medicationId: row.medicationId,
          userId: row.userId,
          medication: row.medication,
          dosage: row.dosage,
          quantity: row.quantity,
        }));

      const hasRealMedications = this.medications.some(
        (med) => med.medication !== ''
      );
      this.listEmpty.set(hasRealMedications);
      this.refreshMeds();
    });
  }
  openChat() {
    this.chatModalVisible = true;
  }

  closeChat() {
    this.chatModalVisible = false;
  }
  onSubmitEditMeds() {
    this.medicationService.upsertMedication(this.editingMeds).subscribe(
      () => {
        console.log('Medication modified successfully');
      },
      (error) => {
        console.error('Failed to modify medication', error);
      }
    );
    this.editingMeds = null;
    this.loadPatientWithMedications();
    this.refreshMeds();
  }

  refreshMeds() {
    this.medicationService
      .getPatientComplete(this.userId)
      .subscribe((data) /* To retrieve all the users */ => {
        this.medications = data
          .filter((row) => row.medicationId !== null)
          .map((row) => ({
            medicationId: row.medicationId,
            userId: row.userId,
            medication: row.medication,
            dosage: row.dosage,
            quantity: row.quantity,
          }));
      });
    const hasRealMedications = this.medications.some(
      (med) => med.medication !== ''
    );

    this.listEmpty.set(hasRealMedications);
  }

  editMedication(med: any) {
    this.editingMeds = { ...med };
  }

  onCloseEditMeds() {
    this.editingMeds = null;
  }

  deleteMedication(med: any) {
    this.confirmDelete(med);
  }
  addMedication() {
    this.newMeds = {
      userId: 0,
      medicationId: 0,
      medication: '',
      dosage: '',
      quantity: 0,
    };
    this.addMeds = true;
  }
  onCloseAddMeds() {
    this.addMeds = false;
  }
  onSubmitAddMeds() {
    this.newMeds.userId = Number(this.userId);
    this.medicationService.upsertMedication(this.newMeds).subscribe(
      () => {
        console.log('Medication inserted successfully');
        const hasRealMedications = this.medications.some(
          (med) => med.medication !== ''
        );

        this.listEmpty.set(hasRealMedications);
        this.refreshMeds();

        this.loadPatientWithMedications();
        console.log(this.listEmpty);
      },
      (error) => {
        console.error('Failed to inserted medication', error);
      }
    );
    this.loadPatientWithMedications();
    this.refreshMeds();
    this.addMeds = false;
  }

  confirmDelete(medication: Medication) {
    if (confirm(`Are you sure you want to delete ${medication.medication}?`)) {
      this.medicationService
        .deleteMedication(medication.medicationId)
        .subscribe({
          next: () => {
            console.log('Medication deleted!');
            this.loadPatientWithMedications();
            this.refreshMeds();
          },
          error: (error) => {
            console.error('Error deleting Medication:', error);
            alert('Failed to delete Medication');
          },
        });
    }
  }
}

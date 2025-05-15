import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Prescription, Patient } from '../pacient.model';
import { FormsModule } from '@angular/forms';
import { EditPacientComponent } from '../edit-pacient/edit-pacient.component';
import { EditMedicationComponent } from '../edit-medication/edit-medication.component';
import { PatientService } from '../pacient.service';

@Component({
  selector: 'app-show-patients',
  standalone: true,
  imports: [FormsModule, EditPacientComponent, EditMedicationComponent],
  templateUrl: './show-patients.component.html',
  styleUrl: './show-patients.component.css',
})
export class ShowPatientsComponent {
  @Input() patients!: Patient[];
  @Input() newMedication!: Prescription;
  @Output() editSuccessfully = new EventEmitter<void>();
  @Output() deleteSuccessfully = new EventEmitter<void>();
  
  editingPatient: any = null;
  addingMedicationFor: any = null;

  constructor(protected patientService: PatientService) {}

  startEditPatient(patient: any) {
    this.editingPatient = { ...patient };
    this.addingMedicationFor = null;
  }

  onSubmitEditingPatient() {
    this.patientService.upsertPatient(this.editingPatient).subscribe({
      next: () => {
        console.log('Patient edited successfully');
        this.editSuccessfully.emit();
        this.editingPatient = null;

        const container = document.querySelector(
          '.patient-list'
        ) as HTMLElement;
        if (container) {
          container.style.display = 'none';
          container.offsetHeight; // trigger reflow
          container.style.display = 'flex';
        }
      },
      error: (error) => {
        console.error('Failed to upsert patient', error);
        this.editingPatient = null;
      },
    });
  }

  isEditingOrAdding(patient: Patient): boolean {
    return this.editingPatient || this.addingMedicationFor;
  }

  onCloseEditTask() {
    this.editingPatient = null;
  }

  onCloseMedication() {
    this.addingMedicationFor = null;
  }

  confirmDelete(patient: Patient) {
    if (
      confirm(
        `Are you sure you want to delete ${patient.firstName} ${patient.lastName}?`
      )
    ) {
      this.patientService.deletePatient(patient.userId).subscribe({
        next: () => {
          console.log('Patient deleted!');
          this.deleteSuccessfully.emit();
        },
        error: (error) => {
          console.error('Error deleting patient:', error);
          alert('Failed to delete patient');
        },
      });
    }
  }

  startAddMedication(patient: any) {
    this.addingMedicationFor = patient;
    this.editingPatient = null;
    this.newMedication = {
      userId: this.addingMedicationFor.userId,
      medicationId: 0,
      medication: '',
      dosage: '',
      quantity: 0,
    };
  }

}

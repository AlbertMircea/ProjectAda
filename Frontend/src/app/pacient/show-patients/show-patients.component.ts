import { Component, Input, signal } from '@angular/core';
import { NewMedication, Patient } from '../pacient.model';
import { FormsModule } from '@angular/forms';
import { EditPacientComponent } from '../edit-pacient/edit-pacient.component';
import { EditMedicationComponent } from '../edit-medication/edit-medication.component';

@Component({
  selector: 'app-show-patients',
  standalone: true,
  imports: [FormsModule, EditPacientComponent, EditMedicationComponent],
  templateUrl: './show-patients.component.html',
  styleUrl: './show-patients.component.css',
})
export class ShowPatientsComponent {
  @Input() patients!: Patient[];
  @Input() newMedication!: NewMedication;

  editingPatient: any = null;
  addingMedicationFor: any = null;

  startEditPatient(patient: any) {
    this.editingPatient = { ...patient };
    this.addingMedicationFor = null;
  }

  onCloseEditTask() {
    this.editingPatient = null;
  }
  onCloseMedication() {
    this.addingMedicationFor = null;
  }

  cancelEdit() {
    this.editingPatient = null;
  }

  updatePatient() {
    // Call API with updated data here
    this.editingPatient = null;
  }

  startAddMedication(patient: any) {
    this.addingMedicationFor = patient;
    this.editingPatient = null;
    this.newMedication = {
      userId: 0,
      medicationId: 0,
      medication: '',
      dosage: '',
      quantity: 0,
    };
  }

  submitMedication(patient: any) {
    // Post new medication to backend with patient ID
    this.addingMedicationFor = null;
  }

  cancelMedication() {
    this.addingMedicationFor = null;
  }
}

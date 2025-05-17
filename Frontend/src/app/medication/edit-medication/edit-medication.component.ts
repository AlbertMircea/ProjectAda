import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../pacient/pacient.service';
import { MedicationService } from '../medication.service';
import { Medication } from '../medication.model';

@Component({
  selector: 'app-edit-medication',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-medication.component.html',
  styleUrl: './edit-medication.component.css',
})
export class EditMedicationComponent {
  @Input() newMedication!: Medication;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();
  constructor(protected patientService: PatientService, protected medicationService: MedicationService) {}

  onCancel() {
    this.close.emit();
  }

  onSubmitMedication() {
    this.submit.emit();
  }
}
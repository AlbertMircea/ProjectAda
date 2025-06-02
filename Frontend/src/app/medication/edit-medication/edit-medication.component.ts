import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../services/pacient.service';
import { MedicationService } from '../../services/medication.service';
import { Medication } from '../../models/medication.model';

@Component({
  selector: 'app-edit-medication',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-medication.component.html',
  styleUrl: './edit-medication.component.css',
})
export class EditMedicationComponent {
  @Input() newMedication!: Medication;
  @Input() titleText!: string;
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
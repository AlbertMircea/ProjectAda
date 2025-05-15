import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Prescription, Patient } from '../pacient.model';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../pacient.service';

@Component({
  selector: 'app-edit-medication',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-medication.component.html',
  styleUrl: './edit-medication.component.css',
})
export class EditMedicationComponent {
  @Input() newMedication!: Prescription;
  @Output() close = new EventEmitter<void>();
  constructor(protected patientService: PatientService) {}

  onCancel() {
    this.close.emit();
  }

  onSubmitMedication() {
    this.patientService.upsertMedication(this.newMedication).subscribe(
      () => {
        console.log('Medication upserted successfully');
      },
      (error) => {
        console.error('Failed to upsert medication', error);
      }
    );

    this.close.emit();
  }
}

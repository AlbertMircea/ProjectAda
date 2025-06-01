import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Patient } from '../../models/pacient.model';
import { PatientService } from '../../services/pacient.service';

@Component({
  selector: 'app-edit-pacient',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-pacient.component.html',
  styleUrl: './edit-pacient.component.css',
})
export class EditPacientComponent {
  @Input() patient!: Patient;
  @Input() editPurposeText = '';
  @Output() cancel = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();

  doctors: { userId: number; firstName: string; lastName: string }[] = [];
  loggedInDoctorId: number = 0;

  constructor(protected patientService: PatientService) {}

  ngOnInit(): void {
    this.patient.gender = this.patientService.capitalizeFirstLetter(
      this.patient.gender
    );

    const userId = this.patientService.getUserIdFromToken();

    if (userId) {
      this.loggedInDoctorId = userId;
      this.patient.doctorID = this.loggedInDoctorId;
    }

    this.patientService.getAllDoctors().subscribe({
      next: (docs) => (this.doctors = docs),
      error: (err) => console.error('Failed to load doctors', err),
    });
  }

  onCancel() {
    this.cancel.emit();
  }

  onSubmitEditPatient() {
    this.submit.emit();
  }
}

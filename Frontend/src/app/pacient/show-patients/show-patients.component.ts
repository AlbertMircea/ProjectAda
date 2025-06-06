import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { Patient } from '../../models/pacient.model';
import { FormsModule } from '@angular/forms';
import { EditPacientComponent } from '../edit-pacient/edit-pacient.component';
import { PatientService } from '../../services/pacient.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-show-patients',
  standalone: true,
  imports: [FormsModule, EditPacientComponent],
  templateUrl: './show-patients.component.html',
  styleUrl: './show-patients.component.css',
})
export class ShowPatientsComponent implements OnChanges {
  @Input() patients!: Patient[];
  @Output() editSuccessfully = new EventEmitter<void>();
  @Output() deleteSuccessfully = new EventEmitter<void>();

  doctorMap = new Map<number, string>();
  roleOfTheLoggedUser = signal<string>('No role');

  editingPatient: any = null;
  redirectToMedication = false;

  constructor(
    protected patientService: PatientService,
    private router: Router,
    private notifyService: NotificationService
  ) {}

  ngOnInit(): void {
    this.roleOfTheLoggedUser.set(localStorage.getItem('role') ?? 'No role');
    this.notifyService.notify('Update', 'Testing the notification!');
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['patients'] && this.patients && this.patients.length > 0) {
      this.setPatientsDoctorsName();
    }
  }

  setPatientsDoctorsName() {
    this.patients.forEach((patient) => {
      if (this.doctorMap.has(patient.doctorID)) {
        patient.doctorName = this.doctorMap.get(patient.doctorID)!;
      } else {
        this.patientService
          .getUserByID(patient.doctorID.toString())
          .subscribe((user) => {
            const fullName = `${user.firstName} ${user.lastName}`;
            this.doctorMap.set(patient.doctorID, fullName);
            patient.doctorName = fullName;
          });
      }
    });
  }
  startEditPatient(patient: any) {
    this.editingPatient = { ...patient };
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
          container.offsetHeight; 
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
    return this.editingPatient;
  }

  onCloseEditTask() {
    this.editingPatient = null;
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

  goToMedications(userId: number) {
    this.router.navigate(['/view-medication', userId]);
  }
}

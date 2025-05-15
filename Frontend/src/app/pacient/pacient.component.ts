import { Component, signal } from '@angular/core';
import { PatientService } from './pacient.service';
import { Patient, Prescription } from './pacient.model';
import { HeaderComponent } from '../header/header.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EditPacientComponent } from './edit-pacient/edit-pacient.component';
import { ShowPatientsComponent } from './show-patients/show-patients.component';

@Component({
  selector: 'app-pacient',
  standalone: true,
  imports: [
    HeaderComponent,
    FormsModule,
    EditPacientComponent,
    ShowPatientsComponent,
  ],
  templateUrl: './pacient.component.html',
  styleUrl: './pacient.component.css',
})
export class PacientComponent {
  patients = signal<Patient[]>([]);
  initialPatients = signal<Patient[]>([]);

  showAddPatientForm = false;
  isFirstTime = 0;
  username = '';
  searchTerm = '';
  isEditing = false;

  newMedication!: Prescription;
  newPatient: Patient = {
    userId: 0,
    email: '',
    firstName: '',
    lastName: '',
    gender: '',
    active: true,
    doctorID: this.patientService.getUserIdFromToken(),
    ward: '',
    room: '',
  };

  constructor(
    protected patientService: PatientService,
    private router: Router
  ) {}

  onCloseEditTask() {
    this.isEditing = false;
    this.refreshPatients(true);
  }

  onSubmitAddingPatient() {
    this.patientService.upsertPatient(this.newPatient).subscribe({
      next: () => {
        console.log('Patient added successfully');
      },
      error: (error) => {
        console.error('Failed to upsert patient', error);
      },
    });
    this.isEditing = false;
    this.refreshPatients(true);

  }

  onSearch() {
    if (this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      this.patients.set(
        this.patients().filter((patient) =>
          `${patient.firstName} ${patient.lastName}`
            .toLowerCase()
            .includes(term)
        )
      );
    } else {
      this.patients.set(this.initialPatients());
    }
  }

  onAddPatient() {
    this.isEditing = true;
  }

  refreshPatients(init: boolean) {
    this.patientService.getPatients().subscribe((data) => {
      this.patients.set(data);
      if (init === true) {
        this.initialPatients.set(data);
        this.isFirstTime = 1;
      }
    });
    
  }

  ngOnInit(): void {
    this.username = localStorage.getItem('username') ?? 'User';

    if (this.username.includes('@')) {
      const index = this.username.indexOf('@');
      this.username = this.patientService.capitalizeFirstLetter(this.username);
      this.username = ' ' + this.username.slice(0, index);
    } else {
      this.username = this.patientService.capitalizeFirstLetter(this.username);
      this.username = ' ' + this.username;
    }
    this.refreshPatients(true);
  }

  goBack() {
    this.router.navigate(['/main']);
  }
}

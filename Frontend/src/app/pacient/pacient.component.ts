import { Component, computed, signal } from '@angular/core';
import { PatientService } from '../services/pacient.service';
import { Patient } from '../models/pacient.model';
import { HeaderComponent } from '../header/header.component';
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
  doctorIdOfLoggedUser = signal<number | undefined>(undefined);
  roleOfTheLoggedUser = signal<string>('No role');
  initialPatients = signal<Patient[]>([]);

  showAddPatientForm = false;
  isFirstTime = 0;
  username = '';
  searchTerm = '';
  isEditing = false;
  isSubmitting = false;


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
    doctorName: '',
  };

  constructor(protected patientService: PatientService) {}

  onCloseEditTask() {
    this.isEditing = false;
    this.refreshPatients(true);
  }

  onSubmitAddingPatient() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.patientService.upsertPatient(this.newPatient).subscribe({
      next: () => {
        console.log('Patient added successfully');
        this.isEditing = false;
        this.isSubmitting = false;
        this.refreshPatients(true);
        this.newPatient = {
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
      },
      error: (error) => {
        console.error('Failed to upsert patient', error);
        this.isEditing = false;
        this.isSubmitting = false;
      },
    });
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
    this.patientService.getAllPatients().subscribe((data) => {
      const uniquePatientsMap = new Map<number, any>();

      for (const patient of data) {
        if (!uniquePatientsMap.has(patient.userId)) {
          uniquePatientsMap.set(patient.userId, patient);
        }
      }
      const uniquePatients = Array.from(uniquePatientsMap.values());
      this.patients.set(uniquePatients);

      if (init === true) {
        this.initialPatients.set(uniquePatients);
        this.isFirstTime = 1;
      }
    });
  }

  ngOnInit(): void {
    this.username = localStorage.getItem('username') ?? 'User';

    this.username = this.patientService.makeNiceUsername(this.username);
    this.refreshPatients(true);
    const roleFromStorage = localStorage.getItem('role');
    this.roleOfTheLoggedUser.set(roleFromStorage ?? 'No role');

    if (this.roleOfTheLoggedUser() === 'Doctor') {
      this.patientService
        .getUserIdLoggedInUserAndSetRole()
        .subscribe((doctorId) => {
          if (doctorId !== undefined) {
            this.doctorIdOfLoggedUser.set(doctorId);
          }
        });
    }
  }
  filteredPatients = computed(() => {
    const role = this.roleOfTheLoggedUser();
    const doctorId = this.doctorIdOfLoggedUser();
    const allPatients = this.patients();

    if (role === 'Doctor' && doctorId !== undefined) {
      return allPatients.filter((p) => p.doctorID === doctorId);
    }

    return allPatients;
  });
}

import { Component, signal } from '@angular/core';
import { PatientService } from './pacient.service';
import { Patient,NewMedication } from './pacient.model';
import { HeaderComponent } from "../header/header.component";
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EditPacientComponent } from './edit-pacient/edit-pacient.component';
import { ShowPatientsComponent } from "./show-patients/show-patients.component";

@Component({
  selector: 'app-pacient',
  standalone: true,
  imports: [HeaderComponent, FormsModule, EditPacientComponent, ShowPatientsComponent],
  templateUrl: './pacient.component.html',
  styleUrl: './pacient.component.css'
})
export class PacientComponent {
  patients = signal<Patient[]>([]);
  initialPatients = signal<Patient[]>([]);
  showAddPatientForm = false;
  isFirstTime = 0;
  username = '';

  isEditing = false;
  isFetching = signal(false);

  newMedication!:NewMedication;
  newPatient!:Patient;
  searchTerm: string = '';
  constructor(protected patientService: PatientService, private router: Router) {}

  onCloseEditTask()
  {
    this.isEditing = false;
  }
  onSearch() {
    console.log(this.searchTerm + "x")
    if (this.searchTerm.trim() !== '')
    {
      const term = this.searchTerm.toLowerCase();
      this.patients.set(this.patients().filter(patient =>
        `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(term)
      ));
    }
    else{
      console.log(this.initialPatients());
      this.patients.set(this.initialPatients());
    }
  }
  
  onAddPatient()
  {
    this.isEditing = true;
  }
  
  
 
  
  createPatient() {
    // POST this.newPatient
    this.showAddPatientForm = false;
  }



  ngOnInit(): void {
    this.username = localStorage.getItem('username') ?? 'User';
    const index = this.username.indexOf("@");
    this.username = " " + this.username.slice(0, index)
    this.isFetching.set(true);
    this.patientService.isFetching.set(true);
    this.patientService.getPatients().subscribe((data) => {
      this.patientService.getPatients().subscribe(data => {
        this.patients.set(data); 
        if(this.isFirstTime === 0)
        {
          this.initialPatients.set(data);
          this.isFirstTime = 1;
          console.log(data);
        }
        });
        
        
    });
    this.patientService.isFetching.set(false);
    this.isFetching.set(false);
  }
  goBack() {
    this.router.navigate(['/main']);
  }

}

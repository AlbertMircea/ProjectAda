import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Patient } from '../pacient.model';
import { PatientService } from '../pacient.service';

@Component({
  selector: 'app-edit-pacient',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-pacient.component.html',
  styleUrl: './edit-pacient.component.css'
})
export class EditPacientComponent {
  @Input() patient!: Patient;
  @Input() editPurposeText = '';
  @Output() cancel =new EventEmitter<void>();
  @Output() submit =new EventEmitter<void>();


  constructor(
    protected patientService: PatientService,
  ) {}

  ngOnInit(): void 
  {
    this.patient.gender = this.patientService.capitalizeFirstLetter(this.patient.gender);
  }

  onCancel(){
    this.cancel.emit();
  }

  onSubmitEditPatient(){
    this.submit.emit();

  }
}



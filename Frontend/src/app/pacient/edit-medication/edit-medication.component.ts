import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NewMedication, Patient } from '../pacient.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-medication',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-medication.component.html',
  styleUrl: './edit-medication.component.css'
})
export class EditMedicationComponent {
  @Input() newMedication!: NewMedication;
  @Output() close =new EventEmitter<void>();


  onCancel(){
    this.close.emit();
    console.log("CLOSED!");
  }

  onSubmit(){

    this.close.emit();
  }
}

import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Patient } from '../pacient.model';

@Component({
  selector: 'app-edit-pacient',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-pacient.component.html',
  styleUrl: './edit-pacient.component.css'
})
export class EditPacientComponent {
  @Input() patient!: Patient;
  @Output() close =new EventEmitter<void>();
  enteredTitle = '';
  enteredSummary = '';
  enteredDueDate = '';
  private tasksService = 'inject(TaskService);'

  onCancel(){
    this.close.emit();
  }

  onSubmit(){

    this.close.emit();
  }
}



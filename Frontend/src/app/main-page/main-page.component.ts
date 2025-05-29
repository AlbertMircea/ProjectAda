import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { Router } from '@angular/router';
import { PatientService } from '../services/pacient.service';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent implements OnInit {
  @Input({ required: true }) username!: string;
  @Input({ required: true }) role!: string;
  @Input({ required: true }) token!: string;
  
  constructor(
    private router: Router,
    private service: PatientService
  ) {}

  goToPatients() {
    this.router.navigate(['/patients']);
  }
  goToTransports() {
    this.router.navigate(['/medication-requests']);
  }

  ngOnInit(): void {
    this.username = localStorage.getItem('username') ?? 'User';
    this.token = localStorage.getItem('authToken') ?? 'No Token';
    this.role = localStorage.getItem('role') ?? 'No role';

    this.username = this.service.makeNiceUsername(this.username);
  }
}

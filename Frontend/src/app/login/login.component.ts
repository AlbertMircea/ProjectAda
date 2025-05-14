import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../header/header.component";
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { PatientService } from '../pacient/pacient.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  isFetching = signal(false);
  error = signal('');
  success = signal(false);
  email = '';
  password = '';

  constructor(private router: Router, private service:PatientService) {}

  goToRegister() {
  this.router.navigate(['/register']);
}

  login(email: string, password: string): void {
    this.isFetching.set(true);
    const loginPayload = {
      email: email,
      password: password
    };

    this.httpClient
    .post<{ token: string }>('https://aleznauerdtc1.azurewebsites.net/Auth/Login', loginPayload)
    .subscribe({
      next: (response) => {
        this.isFetching.set(false);
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('username', loginPayload.email);
        console.log('Login successful!');
        this.success.set(true);
        this.error.set('')
        this.service.getRoleWorkerOfLoggedInUser();

        setTimeout(() => 
          {
            window.location.href = '/main';
          },
          3000);
        
      },
      error: (error) => {
        this.isFetching.set(false);
        console.error('Login failed:', error);
        this.error.set('Invalid credentials or server error.');
        this.success.set(false);
      }
    });


    
  }
}

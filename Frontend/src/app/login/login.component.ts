import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { PatientService } from '../services/pacient.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  isFetching = signal(false);
  error = signal('');
  success = signal(false);
  email = '';
  password = '';

  constructor(private router: Router, private service: PatientService) {}

  goToRegister() {
    this.router.navigate(['/register']);
  }

  login(email: string, password: string): void {
    this.isFetching.set(true);
    const loginPayload = {
      email: email,
      password: password,
    };

    this.httpClient
      .post<{ token: string }>(this.service.getApiAuthLogin(), loginPayload)
      .subscribe({
        next: (response) => {
          this.isFetching.set(false);
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('username', loginPayload.email);
          console.log('Login successful!');
          this.success.set(true);
          this.error.set('');
          this.service.getUserIdLoggedInUserAndSetRole().subscribe((userId) => {
            if (userId && userId > 0) {
              console.log('Logged-in user ID:', userId);
            } else {
              console.warn('User ID not found or invalid.');
            }
          });
          setTimeout(() => {
            this.router.navigate(['/main']);
          }, 3000);
        },
        error: (error) => {
          this.isFetching.set(false);

          if (error.status === 401) {
            this.error.set(error.error || 'Unauthorized: Incorrect password.');
          } else {
            this.error.set(
              'Login failed: User not found or server error ( no access )'
            );
          }

          this.success.set(false);
          console.error('Login failed:', error);
        },
      });
  }
}

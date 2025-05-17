import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PatientService } from '../pacient/pacient.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, HeaderComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  isFetching = signal(false);
  error = signal('');
  success = signal(false);

  email = '';
  password = '';
  confirmPassword = '';
  firstName = '';
  lastName = '';
  gender = '';
  role = '';

  constructor(private router: Router, private http: HttpClient, private service:PatientService) {}

  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  onCancel() {
    this.router.navigate(['/login']);
  }

  onSubmitRegister() {
    const patientData = {
      email: this.email,
      password: this.password,
      passwordConfirm: this.confirmPassword,
      firstName: this.firstName,
      lastName: this.lastName,
      gender: this.gender,
      roleWorker: this.role,
    };
    if (this.email != '' && this.password != '' && this.confirmPassword != '') {
      this.httpClient.post(this.service.getApiAuthRegister(), patientData).subscribe({
        next: (response) => {
          this.isFetching.set(false);
          localStorage.setItem('username', this.email);
          localStorage.setItem('role', this.role);
          console.log('Register successfully!');
          this.success.set(true);
          this.error.set('');

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        error: (error) => {
          this.isFetching.set(false);
          console.error('Register failed:', error);
          this.error.set('User already created or server error.');
          this.success.set(false);
        },
      });
    } else {
      if (this.email.trim() == '') this.error.set("The email can't be empty!");
      else if (this.password.trim() == '')
        this.error.set("The password can't be empty!");
      else this.error.set("The confirm password can't be empty!");
    }
  }
}

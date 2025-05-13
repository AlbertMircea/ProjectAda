import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../header/header.component";
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isFetching = signal(false);
  error = signal('');
  success = signal(false);
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  email = '';
  password = '';

  constructor(private router: Router) {}

  goToRegister() {
  this.router.navigate(['/register']);
}

  // getUsers() {
  //   this.isFetching.set(true);
  //   const subscription = this.httpClient
  //     .get<{ Users: User[] }>('https://aleznauerdtc1.azurewebsites.net/UserComplete/GetUsers/0/false')
  //     .pipe(
  //       map((resData) => resData.Users),
  //       catchError((error) => {
  //         console.log(error);
  //         return throwError(
  //           () =>
  //             new Error(
  //               'Something went wrong fetching the users. Please try again later.'
  //             )
  //         );
  //       })
  //     )
  //     .subscribe({
  //       next: (users) => {
  //         this.users.set(users);

  //       },
  //       error: (error: Error) => {
  //         this.error.set(error.message);
  //       },
  //       complete: () => {
  //         this.isFetching.set(false);
  //       },
  //     });

  //   this.destroyRef.onDestroy(() => {
  //     subscription.unsubscribe();
  //   });
  // }

  login(email: string, password: string): void {
    this.isFetching.set(true);
    const loginPayload = {
      email: email,
      password: password
    };

    console.log(loginPayload);
    this.httpClient
    .post<{ token: string }>('https://aleznauerdtc1.azurewebsites.net/Auth/Login', loginPayload)
    .subscribe({
      next: (response) => {
        this.isFetching.set(false);
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('username', loginPayload.email);
        localStorage.setItem('role', "Doctor"); // TO DO
        console.log('Login successful!');
        this.success.set(true);
        this.error.set('')

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

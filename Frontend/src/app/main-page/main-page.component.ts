import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component'; // adjust path if needed
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  @Input({required: true}) username!: string;
  @Input({required: true}) role!: string;
  @Input({required: true}) token!: string;


  index = 0;
  constructor(private router: Router) {}

  goToPatients() {
    this.router.navigate(['/patients']);
  }

  ngOnInit(): void {
    this.username = localStorage.getItem('username') ?? 'User';
    this.token = localStorage.getItem('authToken') ?? 'No Token';
    this.role = localStorage.getItem('role') ?? 'No role';

    console.log(this.token);
    console.log(this.role);
    console.log(this.username);

    this.index = this.username.indexOf("@");
    this.username = " " + this.username.slice(0, this.index)


    console.log(this.username);
    
  }
}

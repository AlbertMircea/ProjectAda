import { Component, Input } from '@angular/core';
import { NavigationService } from '../app-routes/navigation.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  @Input() text = '';
  @Input() backButtonVisible = false;
  @Input() isTheMainPage = false;
  constructor(
    private navigationService: NavigationService,
    private router : Router
  ) {}

  goBack() {
    this.navigationService.goBack();
  }
    logout() {
    localStorage.clear(); 
    this.router.navigate(['/login']);
  }
}

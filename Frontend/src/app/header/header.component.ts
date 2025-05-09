import {Component, Input} from '@angular/core';
import { Router } from '@angular/router';
@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent
{
    @Input() text = '';
    @Input() backButtonVisible = 'dont show';
    constructor(private router: Router) {}

    goBack() {
        this.router.navigate(['/main']); // or ['/main'] depending on your route
      }
}
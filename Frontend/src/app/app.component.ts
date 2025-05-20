import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './app.component.html'
})
export class AppComponent {

  constructor(private notificationService: NotificationService) {
  this.notificationService.requestPermission();
}
}

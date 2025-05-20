import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private toastr: ToastrService) {}
  requestPermission() {
  if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
    Notification.requestPermission();
  }
}


notify(title: string, message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') {
  const showToastr = () => {
    switch (type) {
      case 'success': this.toastr.success(message, title); break;
      case 'error': this.toastr.error(message, title); break;
      case 'warning': this.toastr.warning(message, title); break;
      default: this.toastr.info(message, title); break;
    }
  };

  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      new Notification(title, { body: message });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        permission === 'granted' ? new Notification(title, { body: message }) : showToastr();
      });
    } else {
      showToastr();
    }
  } else {
    showToastr();
  }
}




}

import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private hubConnection: signalR.HubConnection;

  constructor(private toastr: ToastrService) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://aleznauerdtc2.azurewebsites.net/hubs/notifications')
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('ReceiveMessage', (message: string) => {
      console.log('📬 Notification received:', message);
      this.notify('📬', message);
    });

    this.startConnection();
  }
  private startConnection(): void {
    if (this.hubConnection.state === signalR.HubConnectionState.Disconnected) {
      this.hubConnection
        .start()
        .then(() => console.log('✅ SignalR connected'))
        .catch((err) => console.error('❌ SignalR connection error:', err));
    }
  }
  requestPermission() {
    if (
      'Notification' in window &&
      Notification.permission !== 'granted' &&
      Notification.permission !== 'denied'
    ) {
      Notification.requestPermission();
    }
  }

  notify(
    title: string,
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info'
  ) {
    const showToastr = () => {
      switch (type) {
        case 'success':
          this.toastr.success(message, title);
          break;
        case 'error':
          this.toastr.error(message, title);
          break;
        case 'warning':
          this.toastr.warning(message, title);
          break;
        default:
          this.toastr.info(message, title);
          break;
      }
    };

    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, { body: message });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          permission === 'granted'
            ? new Notification(title, { body: message })
            : showToastr();
        });
      } else {
        showToastr();
      }
    } else {
      showToastr();
    }
  }
}

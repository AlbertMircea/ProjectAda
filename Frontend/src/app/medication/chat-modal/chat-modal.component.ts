import { Component, NgZone } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-chat-modal',
  standalone: true,
  imports: [FormsModule, MarkdownModule],
  templateUrl: './chat-modal.component.html',
  styleUrl: './chat-modal.component.css',
})
export class ChatModalComponent {
  @Output() close = new EventEmitter<void>();

  constructor(private http: HttpClient, private ngZone: NgZone) {}

  chatInput = '';
  chatReply = '';
  isStreaming = false;
  private currentEventSource?: EventSource;

  sendMessage() {
    this.chatReply = '';
    this.streamChat(this.chatInput);
  }

  formatMarkdown(text: string): string {
    return (
      text
        .replace(/(\d+\.)/g, '\n\t\t$1')
        .replace(/\. ([A-Z])/g, '.\n\t\t$1')
        .replace(/ \- /g, '\n- ')
    );
  }

  streamChat(message: string) {
    this.isStreaming = true;
    if (this.currentEventSource) {
      this.currentEventSource.close();
    }
    const url = `https://aleznauerdtc2.azurewebsites.net/api/Chatbot/stream?message=${encodeURIComponent(
      message
    )}`;
    const eventSource = new EventSource(url);
    this.currentEventSource = eventSource;

    eventSource.onmessage = (event) => {
      if (event.data === '[DONE]') {
        this.isStreaming = false;
        eventSource.close();
        this.ngZone.run(() => {});
      } else {
        this.ngZone.run(() => {
          this.chatReply += this.formatMarkdown(event.data);
        });
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE error', err);
      this.isStreaming = false;
      eventSource.close();
      this.ngZone.run(() => {});
    };
  }

cancelStream() {
  this.isStreaming = false;
  this.currentEventSource?.close();
  this.currentEventSource = undefined;
  this.chatReply += '\n\n_Chat cancelled._';
}

  onClose() {
    this.close.emit();
  }
}

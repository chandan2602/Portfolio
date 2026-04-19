import { Component, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-call-button',
  standalone: true,
  templateUrl: './call-button.html',
  styleUrl: './call-button.css',
})
export class CallButtonComponent {
  calling = signal(false);
  error = signal('');
  success = signal('');

  constructor(private http: HttpClient) {}

  makeCall() {
    const visitorData = sessionStorage.getItem('visitor');
    if (!visitorData) {
      this.error.set('Please login first to make a call.');
      setTimeout(() => this.error.set(''), 3000);
      return;
    }

    const visitor = JSON.parse(visitorData);
    let phone = visitor.phone.trim();
    
    // Add +91 prefix if not present
    if (!phone.startsWith('+')) {
      phone = '+91' + phone;
    }
    
    this.calling.set(true);
    this.error.set('');
    this.success.set('');

    this.http.post<{ message: string; vapi: any }>(
      `${environment.apiUrl}/api/call`,
      { phone: phone }
    ).subscribe({
      next: (res) => {
        this.calling.set(false);
        this.success.set('Call initiated successfully!');
        setTimeout(() => this.success.set(''), 3000);
      },
      error: (err) => {
        this.calling.set(false);
        this.error.set(err?.error?.detail ?? 'Failed to initiate call.');
        setTimeout(() => this.error.set(''), 3000);
      },
    });
  }
}

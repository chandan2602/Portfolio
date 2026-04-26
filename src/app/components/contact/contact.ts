import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { profile } from '../../data/profile.data';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class ContactComponent implements OnInit {
  github = signal(profile.social.github);
  linkedin = signal(profile.social.linkedin);
  email = signal(profile.social.email);

  name = '';
  feedbackEmail = '';
  phone = '';
  message = '';
  loading = signal(false);
  success = signal('');
  error = signal('');

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const visitorData = sessionStorage.getItem('visitor');
    if (visitorData) {
      const visitor = JSON.parse(visitorData);
      this.name = visitor.name || '';
      this.feedbackEmail = visitor.email || '';
      this.phone = visitor.phone || '';
    }
  }

  submitFeedback() {
    if (!this.message.trim()) {
      this.error.set('Please enter your feedback message.');
      setTimeout(() => this.error.set(''), 3000);
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.success.set('');

    this.http
      .post<{ message: string }>(`${environment.apiUrl}/api/feedback`, {
        name: this.name.trim(),
        email: this.feedbackEmail.trim(),
        phone: this.phone.trim(),
        message: this.message.trim(),
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.success.set('Thank you for your feedback!');
          this.message = '';
          setTimeout(() => this.success.set(''), 5000);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err?.error?.detail ?? 'Failed to submit feedback. Please try again.');
          setTimeout(() => this.error.set(''), 3000);
        },
      });
  }
}

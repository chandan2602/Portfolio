import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  name = '';
  email = '';
  phone = '';
  loading = signal(false);
  error = signal('');

  constructor(private router: Router, private http: HttpClient) {}

  submit() {
    if (!this.name.trim() || !this.email.trim() || !this.phone.trim()) {
      this.error.set('Please fill in all fields.');
      return;
    }
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
    if (!emailValid) {
      this.error.set('Please enter a valid email address.');
      return;
    }
    const phoneDigits = this.phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      this.error.set('Phone number must be exactly 10 digits.');
      return;
    }
    this.loading.set(true);

    this.http.post<{ message: string; name: string; role_id: number; id: number }>(
      `${environment.apiUrl}/api/login`,
      { name: this.name.trim(), email: this.email.trim(), phone: this.phone.trim() }
    ).subscribe({
      next: (res) => {
        sessionStorage.setItem('visitor', JSON.stringify({
          id: res.id,
          name: res.name,
          email: this.email.trim(),
          phone: this.phone.trim(),
          role_id: res.role_id,
          is_admin: res.role_id === 1,
        }));
        console.log('Login successful. User data:', {
          id: res.id,
          name: res.name,
          role_id: res.role_id,
          is_admin: res.role_id === 1
        });
        this.loading.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.detail ?? 'Login failed. Please try again.');
      },
    });
  }
}

import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { FooterComponent } from './components/footer/footer';
import { ChatbotComponent } from './components/chatbot/chatbot';
import { CallButtonComponent } from './components/call-button/call-button';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FooterComponent, ChatbotComponent, CallButtonComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  isLoginPage = signal(false);
  visitor = signal<{ name: string; email: string; role_id?: number; is_admin?: boolean } | null>(null);
  dropdownOpen = signal(false);

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      const isLogin = e.urlAfterRedirects === '/login';
      this.isLoginPage.set(isLogin);
      if (!isLogin) this.loadVisitor();
    });
  }

  private loadVisitor() {
    const raw = sessionStorage.getItem('visitor');
    this.visitor.set(raw ? JSON.parse(raw) : null);
  }

  toggleDropdown() {
    this.dropdownOpen.update(v => !v);
  }

  logout() {
    sessionStorage.removeItem('visitor');
    this.visitor.set(null);
    this.dropdownOpen.set(false);
    this.router.navigate(['/login']);
  }

  getInitials(): string {
    const name = this.visitor()?.name ?? '';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }
}

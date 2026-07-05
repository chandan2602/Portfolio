import { Component, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';

interface Visitor {
  id: number;
  name: string;
  email: string;
  phone: string;
  role_id: number;
  created_at?: string;
}

interface AboutEntry {
  id: number;
  category: string;
  title: string;
  description: string;
  tags: string | string[]; // API returns comma-separated string
}

interface AboutForm {
  title: string;
  description: string;
  tags: string;
}

const VALID_CATEGORIES = ['experience', 'project', 'skill', 'bio', 'contact'];

@Component({
  selector: 'app-visitors',
  standalone: true,
  imports: [DatePipe, TitleCasePipe, FormsModule],
  templateUrl: './visitors.html',
  styleUrl: './visitors.css',
})
export class VisitorsComponent implements OnInit {
  // ── Page tabs ──────────────────────────────────────────────
  activeTab = signal<'visitors' | 'about'>('visitors');

  // ── Visitors ──────────────────────────────────────────────
  visitors = signal<Visitor[]>([]);
  visitorsLoading = signal(true);
  visitorsError = signal('');

  // ── About entries ─────────────────────────────────────────
  aboutEntries = signal<AboutEntry[]>([]);
  aboutLoading = signal(true);
  aboutError = signal('');
  aboutSuccess = signal('');

  readonly categories = VALID_CATEGORIES;
  activeCategory = signal(VALID_CATEGORIES[0]);

  editingId = signal<number | null>(null);
  editForm: AboutForm = { title: '', description: '', tags: '' };

  showAddForm = signal(false);
  addForm = { category: VALID_CATEGORIES[0], title: '', description: '', tags: '' };

  private adminRoleId = 1;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadVisitors();
    this.loadAbout();
  }

  setTab(tab: 'visitors' | 'about') { this.activeTab.set(tab); }

  // ── Visitors ──────────────────────────────────────────────
  loadVisitors() {
    this.visitorsLoading.set(true);
    this.http.get<Visitor[]>(`${environment.apiUrl}/api/visitors`).subscribe({
      next: (data) => { this.visitors.set(data); this.visitorsLoading.set(false); },
      error: (err) => { this.visitorsError.set(err?.error?.detail ?? 'Failed to load visitors.'); this.visitorsLoading.set(false); },
    });
  }

  // ── About ─────────────────────────────────────────────────
  loadAbout() {
    this.aboutLoading.set(true);
    this.http.get<AboutEntry[]>(`${environment.apiUrl}/api/about`).subscribe({
      next: (data) => { this.aboutEntries.set(data); this.aboutLoading.set(false); },
      error: (err) => { this.aboutError.set(err?.error?.detail ?? 'Failed to load about entries.'); this.aboutLoading.set(false); },
    });
  }

  /** Normalise tags — API may return a comma-separated string or an array */
  parseTags(tags: string | string[]): string[] {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    return tags.split(',').map(t => t.trim()).filter(Boolean);
  }

  entriesForCategory(cat: string) {
    return this.aboutEntries().filter(e => e.category === cat);
  }

  setCategory(cat: string) {
    this.activeCategory.set(cat);
    this.editingId.set(null);
    this.showAddForm.set(false);
  }

  // ── Edit ──────────────────────────────────────────────────
  startEdit(entry: AboutEntry) {
    this.editingId.set(entry.id);
    this.editForm = {
      title: entry.title,
      description: entry.description,
      tags: this.parseTags(entry.tags).join(', '),
    };
    this.showAddForm.set(false);
  }

  cancelEdit() { this.editingId.set(null); }

  saveEdit(entry: AboutEntry) {
    const body = {
      title: this.editForm.title.trim(),
      description: this.editForm.description.trim(),
      tags: this.editForm.tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    this.http.put<{ message: string }>(
      `${environment.apiUrl}/api/about/${entry.id}?role_id=${this.adminRoleId}`, body
    ).subscribe({
      next: () => { this.editingId.set(null); this.flash('Entry updated.'); this.loadAbout(); },
      error: (err) => this.aboutError.set(err?.error?.detail ?? 'Update failed.'),
    });
  }

  // ── Delete ────────────────────────────────────────────────
  deleteEntry(id: number) {
    if (!confirm('Delete this entry?')) return;
    this.http.delete<{ message: string }>(
      `${environment.apiUrl}/api/about/${id}?role_id=${this.adminRoleId}`
    ).subscribe({
      next: () => { this.flash('Entry deleted.'); this.loadAbout(); },
      error: (err) => this.aboutError.set(err?.error?.detail ?? 'Delete failed.'),
    });
  }

  // ── Add ───────────────────────────────────────────────────
  toggleAddForm() {
    this.showAddForm.update(v => !v);
    this.editingId.set(null);
    this.addForm = { category: this.activeCategory(), title: '', description: '', tags: '' };
  }

  submitAdd() {
    const body = {
      category: this.addForm.category,
      title: this.addForm.title.trim(),
      description: this.addForm.description.trim(),
      tags: this.addForm.tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    this.http.post<{ message: string }>(
      `${environment.apiUrl}/api/about?role_id=${this.adminRoleId}`, body
    ).subscribe({
      next: () => {
        this.showAddForm.set(false);
        this.activeCategory.set(body.category);
        this.flash('Entry added.');
        this.loadAbout();
      },
      error: (err) => this.aboutError.set(err?.error?.detail ?? 'Add failed.'),
    });
  }

  private flash(msg: string) {
    this.aboutSuccess.set(msg);
    this.aboutError.set('');
    setTimeout(() => this.aboutSuccess.set(''), 3000);
  }
}

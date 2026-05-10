import { Component, signal, ElementRef, ViewChild, AfterViewChecked, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { profile } from '../../data/profile.data';
import { CbFormatPipe } from './cb-format.pipe';
import { environment } from '../../../environments/environment';

export const PHONE = profile.social.phone;

interface Message {
  role: 'user' | 'bot';
  text: string;
  time: string;
}

interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `You are an AI assistant for Chandan Kumar Nayak's portfolio website. Be friendly, helpful, and concise.

ABOUT: ${profile.bio}

EXPERIENCE:
${profile.experience.map(e => `- ${e.role} at ${e.company} (${e.period})\n  ${e.bullets.join('\n  ')}`).join('\n')}

PROJECTS:
${profile.projects.map(p => `- ${p.name} (${p.tech})\n  Problem: ${p.problem}\n  Solution: ${p.solution}\n  Impact: ${p.impact}`).join('\n')}

SKILLS: ${profile.skills.map(s => `${s.category}: ${s.items.join(', ')}`).join(' | ')}

CONTACT: Email: ${profile.social.email} | LinkedIn: ${profile.social.linkedin} | GitHub: ${profile.social.github}

Instructions:
- Only answer questions about Chandan Kumar Nayak
- Keep replies concise (2-4 sentences max)
- Use **bold** for key terms
- Be enthusiastic about his work
- If asked something unrelated, redirect to his portfolio topics`;

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, CbFormatPipe],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css',
})
export class ChatbotComponent implements AfterViewChecked {
  @ViewChild('messagesEnd') private messagesEnd!: ElementRef;
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  phone = profile.social.phone;

  isOpen = signal(false);
  isTyping = signal(false);
  userInput = signal('');

  messages = signal<Message[]>([
    {
      role: 'bot',
      text: `👋 Hi! I'm Chandan's AI assistant. Ask me anything about his skills, projects, or experience!\n\nTry: "What projects has Chandan built?" or "What are his skills?"`,
      time: this.now(),
    },
  ]);

  suggestions = [
    'What projects has Chandan built?',
    'What are his skills?',
    'Tell me about his experience',
    'How can I contact him?',
  ];

  private history: GroqMessage[] = [];

  toggle() { this.isOpen.update(v => !v); }

  setInput(val: string) {
    this.userInput.set(val);
    this.send();
  }

  send() {
    const text = this.userInput().trim();
    if (!text || this.isTyping()) return;

    this.addMessage('user', text);
    this.userInput.set('');
    this.isTyping.set(true);

    if (!isPlatformBrowser(this.platformId)) {
      this.isTyping.set(false);
      return;
    }

    this.history.push({ role: 'user', content: text });

    // Check if user is admin (role_id = 1)
    const visitorData = sessionStorage.getItem('visitor');
    console.log('Visitor data from sessionStorage:', visitorData);
    
    if (visitorData) {
      const visitor = JSON.parse(visitorData);
      console.log('Parsed visitor:', visitor);
      console.log('Role ID:', visitor.role_id, 'Type:', typeof visitor.role_id);
      
      const isAdmin = visitor.role_id === 1;
      console.log('Is Admin?', isAdmin);
      
      if (isAdmin) {
        console.log('Using RAG API for admin with role_id:', visitor.role_id);
        this.useRagApi(text, visitor.role_id);
      } else {
        console.log('Using Groq API for visitor');
        this.useGroqApi(text);
      }
    } else {
      console.log('No visitor data, using Groq API');
      this.useGroqApi(text);
    }
  }

  private useRagApi(text: string, roleId: number) {
    const body = { 
      question: text,
      role_id: roleId
    };

    console.log('Sending to RAG API:', body);

    // Check if this is a download request
    const isDownloadRequest = /download|export|save|get file|generate file/i.test(text);

    if (isDownloadRequest) {
      // Handle file download
      this.http.post(`${environment.apiUrl}/api/ask`, body, { 
        responseType: 'blob',
        observe: 'response'
      }).subscribe({
        next: (response) => {
          console.log('File download response:', response);
          
          // Extract filename from Content-Disposition header
          const contentDisposition = response.headers.get('Content-Disposition');
          let filename = 'download.csv';
          if (contentDisposition) {
            const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
            if (matches && matches[1]) {
              filename = matches[1].replace(/['"]/g, '');
            }
          }

          // Create download link
          const blob = response.body;
          if (blob) {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            window.URL.revokeObjectURL(url);

            this.isTyping.set(false);
            this.addMessage('bot', `✅ File downloaded successfully: ${filename}`);
          }
        },
        error: (err) => {
          console.error('RAG API download error:', err);
          this.isTyping.set(false);
          this.addMessage('bot', '⚠️ Failed to download file. Please try again.');
        },
      });
    } else {
      // Handle regular JSON response
      this.http.post<{ answer: string }>(`${environment.apiUrl}/api/ask`, body).subscribe({
        next: (res) => {
          console.log('RAG API response:', res);
          const reply = res?.answer ?? "Sorry, I couldn't get a response. Please try again.";
          this.history.push({ role: 'assistant', content: reply });
          this.isTyping.set(false);
          this.addMessage('bot', reply);
        },
        error: (err) => {
          console.error('RAG API error:', err?.status, err?.error);
          this.isTyping.set(false);
          const errorMsg = err?.error?.detail ?? '⚠️ Something went wrong. Please try again in a moment.';
          this.addMessage('bot', errorMsg);
        },
      });
    }
  }

  private useGroqApi(text: string) {
    // Use backend API for chatbot responses
    const body = { 
      question: text,
      role_id: 0 // Guest user
    };

    this.http.post<{ answer: string }>(`${environment.apiUrl}/api/ask`, body).subscribe({
      next: (res) => {
        const reply = res?.answer ?? "Sorry, I couldn't get a response. Please try again.";
        this.history.push({ role: 'assistant', content: reply });
        this.isTyping.set(false);
        this.addMessage('bot', reply);
      },
      error: (err) => {
        console.error('Backend API error:', err?.status, err?.error);
        this.isTyping.set(false);
        const errorMsg = err?.error?.detail ?? '⚠️ Something went wrong. Please try again in a moment.';
        this.addMessage('bot', errorMsg);
      },
    });
  }

  onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.send();
    }
  }

  private addMessage(role: 'user' | 'bot', text: string) {
    this.messages.update(msgs => [...msgs, { role, text, time: this.now() }]);
  }

  private now(): string {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  ngAfterViewChecked() {
    try { this.messagesEnd?.nativeElement?.scrollIntoView({ behavior: 'smooth' }); } catch {}
  }
}

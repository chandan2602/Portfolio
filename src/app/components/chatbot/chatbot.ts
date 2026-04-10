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
      text: `👋 Hi! I'm Chandan's AI assistant powered by Groq. Ask me anything about his skills, projects, or experience!\n\nTry: "What projects has Chandan built?" or "What are his skills?"`,
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

  private readonly apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

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

    const messages: GroqMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...this.history.slice(-10),
    ];

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${environment.groqApiKey}`,
    });

    const body = {
      model: 'llama-3.3-70b-versatile',
      messages,
      max_tokens: 400,
      temperature: 0.7,
    };

    this.http.post<any>(this.apiUrl, body, { headers }).subscribe({
      next: (res) => {
        const reply = res?.choices?.[0]?.message?.content
          ?? "Sorry, I couldn't get a response. Please try again.";
        this.history.push({ role: 'assistant', content: reply });
        this.isTyping.set(false);
        this.addMessage('bot', reply);
      },
      error: (err) => {
        console.error('Groq API error:', err?.status, err?.error);
        this.isTyping.set(false);
        if (err?.status === 429) {
          this.addMessage('bot', '⏳ Rate limit hit. Please wait a moment and try again.');
        } else {
          this.addMessage('bot', '⚠️ Something went wrong. Please try again in a moment.');
        }
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

import { Component, signal } from '@angular/core';
import { profile } from '../../data/profile.data';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class HeroComponent {
  name = signal(profile.name);
  headline = signal(profile.headlines[0]);
  github = signal(profile.social.github);
  linkedin = signal(profile.social.linkedin);
  email = signal(profile.social.email);
  photoUrl = signal('/images/image.png');
  tags = ['FastAPI', 'Angular', 'AI/ML', 'Python', 'TypeScript', 'Docker'];
}

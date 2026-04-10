import { Component, signal } from '@angular/core';
import { profile } from '../../data/profile.data';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class ContactComponent {
  github = signal(profile.social.github);
  linkedin = signal(profile.social.linkedin);
  email = signal(profile.social.email);
}

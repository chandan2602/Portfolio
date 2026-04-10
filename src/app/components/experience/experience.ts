import { Component, signal } from '@angular/core';
import { profile } from '../../data/profile.data';

@Component({
  selector: 'app-experience',
  standalone: true,
  templateUrl: './experience.html',
  styleUrl: './experience.css',
})
export class ExperienceComponent {
  experience = signal(profile.experience);
}

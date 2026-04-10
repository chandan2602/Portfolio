import { Component, signal } from '@angular/core';
import { profile } from '../../data/profile.data';

@Component({
  selector: 'app-projects',
  standalone: true,
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class ProjectsComponent {
  projects = signal(profile.projects);
}

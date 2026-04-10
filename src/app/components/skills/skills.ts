import { Component } from '@angular/core';

@Component({
  selector: 'app-skills',
  standalone: true,
  templateUrl: './skills.html',
  styleUrl: './skills.css',
})
export class SkillsComponent {
  skillGroups = [
    {
      category: 'Frontend',
      emoji: '🎨',
      color: '#ff6b35',
      items: ['Angular', 'TypeScript', 'HTML/CSS', 'SCSS', 'Chart.js', 'Leaflet.js'],
    },
    {
      category: 'Backend',
      emoji: '⚙️',
      color: '#3b82f6',
      items: ['FastAPI', 'Python', 'REST APIs', 'Docker', 'PostgreSQL', 'SQL/NoSQL'],
    },
    {
      category: 'AI / ML',
      emoji: '🤖',
      color: '#a855f7',
      items: ['TensorFlow', 'NLP', 'Computer Vision', 'Scikit-learn', 'OpenCV', 'Pandas'],
    },
    {
      category: 'Tools',
      emoji: '🛠️',
      color: '#22d3ee',
      items: ['Git', 'GitHub', 'AWS', 'Jira', 'Postman', 'VS Code'],
    },
  ];

  proficiency = [
    { name: 'FastAPI / Python',       pct: 90, color: '#3b82f6', icons: ['🐍', '⚙️'] },
    { name: 'Angular / TypeScript',   pct: 88, color: '#ff6b35', icons: ['🅰️', '📘'] },
    { name: 'Machine Learning / AI',  pct: 82, color: '#a855f7', icons: ['🤖', '🧠'] },
    { name: 'Docker / DevOps',        pct: 75, color: '#22d3ee', icons: ['🐳', '🛠️'] },
  ];

  // circumference = 2 * π * r = 2 * 3.14159 * 40 ≈ 251.2
  getDashOffset(pct: number): number {
    return 251.2 * (1 - pct / 100);
  }
}

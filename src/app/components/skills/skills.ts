import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Skill {
  name: string;
  pct: number;
  icon: string;
}

interface SkillGroup {
  category: string;
  filter: string;
  icon: string;
  color: string;
  skills: Skill[];
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.html',
  styleUrl: './skills.css',
})
export class SkillsComponent {
  activeFilter = signal('all');

  filters = [
    { label: 'All Skills', value: 'all' },
    { label: 'AI / ML', value: 'aiml' },
    { label: 'Backend', value: 'backend' },
    { label: 'Tools', value: 'tools' },
  ];

  skillGroups: SkillGroup[] = [
    {
      category: 'Languages',
      filter: 'backend',
      icon: '💻',
      color: '#3b82f6',
      skills: [
        { name: 'Python', pct: 95, icon: '🐍' },
        { name: 'SQL', pct: 90, icon: '🗄️' },
        { name: 'Java', pct: 75, icon: '☕' },
        { name: 'JavaScript', pct: 85, icon: '🟡' },
        { name: 'Angular', pct: 82, icon: '🅰️' },
        { name: 'FastAPI', pct: 88, icon: '⚡' },
      ],
    },
    {
      category: 'AI / ML Algorithms',
      filter: 'aiml',
      icon: '🧠',
      color: '#a855f7',
      skills: [
        { name: 'Linear Regression', pct: 92, icon: '📈' },
        { name: 'Logistic Regression', pct: 90, icon: '📊' },
        { name: 'Random Forest', pct: 88, icon: '🌲' },
        { name: 'SVM / KNN', pct: 85, icon: '🔵' },
        { name: 'Decision Tree', pct: 87, icon: '🌿' },
        { name: 'Naive Bayes', pct: 83, icon: '📐' },
      ],
    },
    {
      category: 'Deep Learning & AI',
      filter: 'aiml',
      icon: '🤖',
      color: '#06b6d4',
      skills: [
        { name: 'Deep Learning', pct: 88, icon: '🧬' },
        { name: 'Computer Vision', pct: 85, icon: '👁️' },
        { name: 'Generative AI', pct: 82, icon: '✨' },
        { name: 'LLM', pct: 80, icon: '🗣️' },
        { name: 'Hugging Face', pct: 83, icon: '🤗' },
        { name: 'Prompt Engineering', pct: 85, icon: '💬' },
      ],
    },
    {
      category: 'Frameworks & Libs',
      filter: 'aiml',
      icon: '📦',
      color: '#f59e0b',
      skills: [
        { name: 'Streamlit', pct: 88, icon: '🎈' },
        { name: 'Scikit-learn', pct: 90, icon: '🔬' },
        { name: 'TensorFlow', pct: 87, icon: '🔶' },
        { name: 'Pandas', pct: 92, icon: '🐼' },
        { name: 'NumPy', pct: 93, icon: '🔢' },
        { name: 'OpenCV', pct: 82, icon: '📷' },
      ],
    },
    {
      category: 'Developer Tools',
      filter: 'tools',
      icon: '🛠️',
      color: '#f97316',
      skills: [
        { name: 'VS Code', pct: 95, icon: '💻' },
        { name: 'Jupyter Notebook', pct: 93, icon: '📓' },
        { name: 'PyCharm', pct: 85, icon: '🐍' },
        { name: 'Spyder', pct: 80, icon: '🕷️' },
        { name: 'Power BI', pct: 78, icon: '📊' },
        { name: 'Excel', pct: 82, icon: '📗' },
      ],
    },
  ];

  stats = [
    { icon: '⭐', value: '15+', label: 'Technologies' },
    { icon: '💻', value: '3+', label: 'Years of Experience' },
    { icon: '🚀', value: '10+', label: 'Projects Completed' },
    { icon: '🎯', value: '100%', label: 'Passion for Learning' },
  ];

  get visibleGroups(): SkillGroup[] {
    const f = this.activeFilter();
    if (f === 'all') return this.skillGroups;
    return this.skillGroups.filter(g => g.filter === f);
  }

  setFilter(value: string) {
    this.activeFilter.set(value);
  }
}

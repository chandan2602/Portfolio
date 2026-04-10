import { Component } from '@angular/core';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.css',
})
export class TestimonialsComponent {
  testimonials = [
    {
      text: 'Chandan delivered our AI agriculture dashboard ahead of schedule. His ability to bridge machine learning with a clean Angular UI is rare — the farmers loved it.',
      name: 'Priya Sharma',
      role: 'CTO, AgriTech Startup',
      initials: 'PS',
    },
    {
      text: 'Working with Chandan on the job recommendation engine was a great experience. He optimized our FastAPI backend significantly and the NLP accuracy blew us away.',
      name: 'Rahul Mehta',
      role: 'Engineering Lead, XYZ Tech',
      initials: 'RM',
    },
    {
      text: 'Chandan has a rare combination of strong backend skills and an eye for frontend design. His code is clean, well-documented, and always production-ready.',
      name: 'Ananya Iyer',
      role: 'Senior Developer, TechCorp',
      initials: 'AI',
    },
  ];
}

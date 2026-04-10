import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent),
  },
  {
    path: 'about',
    canActivate: [authGuard],
    loadComponent: () => import('./components/about/about').then(m => m.AboutComponent),
  },
  {
    path: 'experience',
    canActivate: [authGuard],
    loadComponent: () => import('./components/experience/experience').then(m => m.ExperienceComponent),
  },
  {
    path: 'projects',
    canActivate: [authGuard],
    loadComponent: () => import('./components/projects/projects').then(m => m.ProjectsComponent),
  },
  {
    path: 'skills',
    canActivate: [authGuard],
    loadComponent: () => import('./components/skills/skills').then(m => m.SkillsComponent),
  },
  {
    path: 'testimonials',
    canActivate: [authGuard],
    loadComponent: () => import('./components/testimonials/testimonials').then(m => m.TestimonialsComponent),
  },
  {
    path: 'contact',
    canActivate: [authGuard],
    loadComponent: () => import('./components/contact/contact').then(m => m.ContactComponent),
  },
  { path: '**', redirectTo: '' },
];

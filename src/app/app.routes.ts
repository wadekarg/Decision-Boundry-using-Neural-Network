import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./lab/lab-page.component').then(m => m.LabPageComponent),
  },
  {
    path: 'lab',
    redirectTo: '',
  },
  {
    path: 'learn',
    loadComponent: () => import('./pages/learn-index.component').then(m => m.LearnIndexComponent),
  },
  {
    path: 'learn/what-is-a-perceptron',
    loadComponent: () => import('./pages/chapter1.component').then(m => m.Chapter1Component),
  },
  {
    path: 'learn/decision-boundaries',
    loadComponent: () => import('./pages/chapter2.component').then(m => m.Chapter2Component),
  },
  {
    path: 'learn/activation-functions',
    loadComponent: () => import('./pages/chapter3.component').then(m => m.Chapter3Component),
  },
  {
    path: 'learn/learning-rule',
    loadComponent: () => import('./pages/chapter4.component').then(m => m.Chapter4Component),
  },
  { path: '**', redirectTo: '' },
];

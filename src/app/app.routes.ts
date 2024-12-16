import { Routes } from '@angular/router';
import { MeusCursosComponent } from './components/meus-cursos/meus-cursos.component';
import { CourseComponent } from './components/course/course.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ConfiguracoesComponent } from './components/configuracoes/configuracoes.component';
import { MainLayoutComponent } from './components/layout/main-layout.component';
import { RenderMode } from '@angular/ssr';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: MeusCursosComponent },
      { path: 'course/:id', component: CourseComponent, data: { renderMode: 'default' }},
      { path: 'profile', component: ProfileComponent },
      { path: 'configurations', component: ConfiguracoesComponent },
    ]
  }
];

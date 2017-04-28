import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SigninComponent } from './signin/signin.component';
import { PageComponent } from './page/page.component';

const appRoutes: Routes = [
  { path: 'signin', component: SigninComponent },
  { path: 'page', component: PageComponent },
  { path: '**', redirectTo: '/page' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, {useHash: true});
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SigninComponent } from './signin/signin.component';
import { RegisterComponent } from './register/register.component';
import { PageComponent } from './page/page.component';

import { AuthGuard } from './auth/auth.guard';


const appRoutes: Routes = [
  { path: 'signin', component: SigninComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'page', component: PageComponent },
  { path: '', component: PageComponent}
  //{ path: 'page', component: PageComponent, canActivate: [AuthGuard] },
  //{ path: '**', redirectTo: '/signin' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, {useHash: true})

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './Components/main-page/main-page.component';
import { SignupPageComponent } from './Components/signup-page/signup-page.component';
import { LoginPageComponent } from './Components/login-page/login-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'main-page', pathMatch: 'full' },
  // { path: 'login', component: LoginPageComponent },
  // { path: 'signup', component: SignupPageComponent },
  { path: 'main-page', component: MainPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

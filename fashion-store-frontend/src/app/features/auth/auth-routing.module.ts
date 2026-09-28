import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { ForgotPasswordPage } from './pages/forgot-password-page/forgot-password-page';
import { RegisterPage } from './pages/register-page/register-page';
import { GuestGuard } from '../../core/guards/guest.guard';

const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "login",           component: LoginPage,           canActivate: [GuestGuard] },
  { path: "register",        component: RegisterPage,        canActivate: [GuestGuard] },
  { path: "forgot-password", component: ForgotPasswordPage,  canActivate: [GuestGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule { }

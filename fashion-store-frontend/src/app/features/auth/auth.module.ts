import { NgModule } from '@angular/core';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginPage } from './pages/login-page/login-page';
import { RegisterPage } from './pages/register-page/register-page';
import { ForgotPasswordPage } from './pages/forgot-password-page/forgot-password-page';
import { PasswordStrength } from './components/password-strength/password-strength';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [LoginPage, RegisterPage, ForgotPasswordPage, PasswordStrength],
  imports: [CommonModule, SharedModule, ReactiveFormsModule, AuthRoutingModule],
})
export class AuthModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [Header, Footer],
  imports: [CommonModule, RouterModule,SharedModule],
  exports: [Header, Footer],
})
export class LayoutModule {}

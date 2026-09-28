import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotFoundRoutingModule } from './not-found-routing.module';
import { NotFoundPage } from './pages/not-found-page/not-found-page';
import { BackToHome } from './components/back-to-home/back-to-home';

@NgModule({
  declarations: [NotFoundPage, BackToHome],
  imports: [CommonModule, NotFoundRoutingModule],
})
export class NotFoundModule {}

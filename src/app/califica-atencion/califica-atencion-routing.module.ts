import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalificaAtencionPage } from './califica-atencion.page';

const routes: Routes = [
  {
    path: '',
    component: CalificaAtencionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalificaAtencionPageRoutingModule {}

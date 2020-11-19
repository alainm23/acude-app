import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EscojeFechaHoraPage } from './escoje-fecha-hora.page';

const routes: Routes = [
  {
    path: '',
    component: EscojeFechaHoraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EscojeFechaHoraPageRoutingModule {}

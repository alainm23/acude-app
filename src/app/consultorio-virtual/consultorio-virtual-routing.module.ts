import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultorioVirtualPage } from './consultorio-virtual.page';

const routes: Routes = [
  {
    path: '',
    component: ConsultorioVirtualPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultorioVirtualPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReservaFalladaPage } from './reserva-fallada.page';

const routes: Routes = [
  {
    path: '',
    component: ReservaFalladaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReservaFalladaPageRoutingModule {}

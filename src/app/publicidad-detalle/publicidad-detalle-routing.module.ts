import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PublicidadDetallePage } from './publicidad-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: PublicidadDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicidadDetallePageRoutingModule {}

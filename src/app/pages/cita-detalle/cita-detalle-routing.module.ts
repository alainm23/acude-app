import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CitaDetallePage } from './cita-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: CitaDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CitaDetallePageRoutingModule {}

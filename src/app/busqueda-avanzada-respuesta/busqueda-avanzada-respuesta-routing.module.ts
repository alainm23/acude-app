import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BusquedaAvanzadaRespuestaPage } from './busqueda-avanzada-respuesta.page';

const routes: Routes = [
  {
    path: '',
    component: BusquedaAvanzadaRespuestaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusquedaAvanzadaRespuestaPageRoutingModule {}

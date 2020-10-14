import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapaEstablecimientosPage } from './mapa-establecimientos.page';

const routes: Routes = [
  {
    path: '',
    component: MapaEstablecimientosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapaEstablecimientosPageRoutingModule {}

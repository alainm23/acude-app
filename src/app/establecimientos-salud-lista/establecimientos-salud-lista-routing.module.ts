import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstablecimientosSaludListaPage } from './establecimientos-salud-lista.page';

const routes: Routes = [
  {
    path: '',
    component: EstablecimientosSaludListaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstablecimientosSaludListaPageRoutingModule {}

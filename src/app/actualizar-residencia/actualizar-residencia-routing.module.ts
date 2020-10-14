import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActualizarResidenciaPage } from './actualizar-residencia.page';

const routes: Routes = [
  {
    path: '',
    component: ActualizarResidenciaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActualizarResidenciaPageRoutingModule {}

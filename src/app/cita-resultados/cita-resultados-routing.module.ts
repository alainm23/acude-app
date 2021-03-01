import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CitaResultadosPage } from './cita-resultados.page';

const routes: Routes = [
  {
    path: '',
    component: CitaResultadosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CitaResultadosPageRoutingModule {}

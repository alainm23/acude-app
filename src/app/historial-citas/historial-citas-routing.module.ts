import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistorialCitasPage } from './historial-citas.page';

const routes: Routes = [
  {
    path: '',
    component: HistorialCitasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistorialCitasPageRoutingModule {}

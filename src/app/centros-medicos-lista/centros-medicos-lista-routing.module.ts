import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CentrosMedicosListaPage } from './centros-medicos-lista.page';

const routes: Routes = [
  {
    path: '',
    component: CentrosMedicosListaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CentrosMedicosListaPageRoutingModule {}

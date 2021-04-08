import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaisNoSoportadoPage } from './pais-no-soportado.page';

const routes: Routes = [
  {
    path: '',
    component: PaisNoSoportadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaisNoSoportadoPageRoutingModule {}

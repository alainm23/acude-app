import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EncuentraProfesionalListaPage } from './encuentra-profesional-lista.page';

const routes: Routes = [
  {
    path: '',
    component: EncuentraProfesionalListaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EncuentraProfesionalListaPageRoutingModule {}

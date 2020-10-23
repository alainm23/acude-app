import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectEspecialidadPage } from './select-especialidad.page';

const routes: Routes = [
  {
    path: '',
    component: SelectEspecialidadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectEspecialidadPageRoutingModule {}

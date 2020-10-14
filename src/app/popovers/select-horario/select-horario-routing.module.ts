import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectHorarioPage } from './select-horario.page';

const routes: Routes = [
  {
    path: '',
    component: SelectHorarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectHorarioPageRoutingModule {}

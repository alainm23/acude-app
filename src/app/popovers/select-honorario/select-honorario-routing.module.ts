import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectHonorarioPage } from './select-honorario.page';

const routes: Routes = [
  {
    path: '',
    component: SelectHonorarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectHonorarioPageRoutingModule {}

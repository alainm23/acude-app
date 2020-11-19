import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AntecedentesPage } from './antecedentes.page';

const routes: Routes = [
  {
    path: '',
    component: AntecedentesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AntecedentesPageRoutingModule {}

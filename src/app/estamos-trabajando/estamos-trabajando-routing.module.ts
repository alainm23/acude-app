import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstamosTrabajandoPage } from './estamos-trabajando.page';

const routes: Routes = [
  {
    path: '',
    component: EstamosTrabajandoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstamosTrabajandoPageRoutingModule {}

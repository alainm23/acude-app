import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectSucursalPage } from './select-sucursal.page';

const routes: Routes = [
  {
    path: '',
    component: SelectSucursalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectSucursalPageRoutingModule {}

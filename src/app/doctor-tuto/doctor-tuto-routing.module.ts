import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DoctorTutoPage } from './doctor-tuto.page';

const routes: Routes = [
  {
    path: '',
    component: DoctorTutoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoctorTutoPageRoutingModule {}

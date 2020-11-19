import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResgistrarDoctorDatosPersonalesPage } from './resgistrar-doctor-datos-personales.page';

const routes: Routes = [
  {
    path: '',
    component: ResgistrarDoctorDatosPersonalesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResgistrarDoctorDatosPersonalesPageRoutingModule {}

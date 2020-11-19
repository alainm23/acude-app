import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResgistrarDoctorDatosPersonalesDosPage } from './resgistrar-doctor-datos-personales-dos.page';

const routes: Routes = [
  {
    path: '',
    component: ResgistrarDoctorDatosPersonalesDosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResgistrarDoctorDatosPersonalesDosPageRoutingModule {}

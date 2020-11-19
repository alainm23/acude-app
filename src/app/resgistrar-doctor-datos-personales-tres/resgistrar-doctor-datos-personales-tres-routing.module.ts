import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResgistrarDoctorDatosPersonalesTresPage } from './resgistrar-doctor-datos-personales-tres.page';

const routes: Routes = [
  {
    path: '',
    component: ResgistrarDoctorDatosPersonalesTresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResgistrarDoctorDatosPersonalesTresPageRoutingModule {}

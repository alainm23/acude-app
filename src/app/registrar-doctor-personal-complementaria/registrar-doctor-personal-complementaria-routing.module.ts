import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrarDoctorPersonalComplementariaPage } from './registrar-doctor-personal-complementaria.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrarDoctorPersonalComplementariaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrarDoctorPersonalComplementariaPageRoutingModule {}

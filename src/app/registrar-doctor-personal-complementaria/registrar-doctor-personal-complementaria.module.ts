import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrarDoctorPersonalComplementariaPageRoutingModule } from './registrar-doctor-personal-complementaria-routing.module';

import { RegistrarDoctorPersonalComplementariaPage } from './registrar-doctor-personal-complementaria.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistrarDoctorPersonalComplementariaPageRoutingModule
  ],
  declarations: [RegistrarDoctorPersonalComplementariaPage]
})
export class RegistrarDoctorPersonalComplementariaPageModule {}

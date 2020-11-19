import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResgistrarDoctorDatosPersonalesPageRoutingModule } from './resgistrar-doctor-datos-personales-routing.module';

import { ResgistrarDoctorDatosPersonalesPage } from './resgistrar-doctor-datos-personales.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResgistrarDoctorDatosPersonalesPageRoutingModule
  ],
  declarations: [ResgistrarDoctorDatosPersonalesPage]
})
export class ResgistrarDoctorDatosPersonalesPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResgistrarDoctorDatosPersonalesDosPageRoutingModule } from './resgistrar-doctor-datos-personales-dos-routing.module';

import { ResgistrarDoctorDatosPersonalesDosPage } from './resgistrar-doctor-datos-personales-dos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResgistrarDoctorDatosPersonalesDosPageRoutingModule
  ],
  declarations: [ResgistrarDoctorDatosPersonalesDosPage]
})
export class ResgistrarDoctorDatosPersonalesDosPageModule {}

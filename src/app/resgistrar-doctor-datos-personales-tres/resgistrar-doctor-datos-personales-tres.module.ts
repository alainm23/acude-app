import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResgistrarDoctorDatosPersonalesTresPageRoutingModule } from './resgistrar-doctor-datos-personales-tres-routing.module';

import { ResgistrarDoctorDatosPersonalesTresPage } from './resgistrar-doctor-datos-personales-tres.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResgistrarDoctorDatosPersonalesTresPageRoutingModule
  ],
  declarations: [ResgistrarDoctorDatosPersonalesTresPage]
})
export class ResgistrarDoctorDatosPersonalesTresPageModule {}

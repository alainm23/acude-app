import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DoctorTutoPageRoutingModule } from './doctor-tuto-routing.module';

import { DoctorTutoPage } from './doctor-tuto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DoctorTutoPageRoutingModule
  ],
  declarations: [DoctorTutoPage]
})
export class DoctorTutoPageModule {}

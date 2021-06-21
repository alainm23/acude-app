import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConsultorioVirtualPageRoutingModule } from './consultorio-virtual-routing.module';

import { ConsultorioVirtualPage } from './consultorio-virtual.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsultorioVirtualPageRoutingModule
  ],
  declarations: [ConsultorioVirtualPage]
})
export class ConsultorioVirtualPageModule {}

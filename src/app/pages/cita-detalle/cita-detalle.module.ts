import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CitaDetallePageRoutingModule } from './cita-detalle-routing.module';

import { CitaDetallePage } from './cita-detalle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CitaDetallePageRoutingModule
  ],
  declarations: [CitaDetallePage]
})
export class CitaDetallePageModule {}

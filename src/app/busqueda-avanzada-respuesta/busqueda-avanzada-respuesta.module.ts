import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BusquedaAvanzadaRespuestaPageRoutingModule } from './busqueda-avanzada-respuesta-routing.module';

import { BusquedaAvanzadaRespuestaPage } from './busqueda-avanzada-respuesta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BusquedaAvanzadaRespuestaPageRoutingModule
  ],
  declarations: [BusquedaAvanzadaRespuestaPage]
})
export class BusquedaAvanzadaRespuestaPageModule {}

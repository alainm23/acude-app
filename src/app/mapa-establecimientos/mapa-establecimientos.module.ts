import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapaEstablecimientosPageRoutingModule } from './mapa-establecimientos-routing.module';

import { MapaEstablecimientosPage } from './mapa-establecimientos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapaEstablecimientosPageRoutingModule
  ],
  declarations: [MapaEstablecimientosPage]
})
export class MapaEstablecimientosPageModule {}

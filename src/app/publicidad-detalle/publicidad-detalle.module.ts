import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PublicidadDetallePageRoutingModule } from './publicidad-detalle-routing.module';

import { PublicidadDetallePage } from './publicidad-detalle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PublicidadDetallePageRoutingModule
  ],
  declarations: [PublicidadDetallePage]
})
export class PublicidadDetallePageModule {}

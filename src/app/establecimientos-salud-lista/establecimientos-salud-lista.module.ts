import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstablecimientosSaludListaPageRoutingModule } from './establecimientos-salud-lista-routing.module';

import { EstablecimientosSaludListaPage } from './establecimientos-salud-lista.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EstablecimientosSaludListaPageRoutingModule
  ],
  declarations: [EstablecimientosSaludListaPage]
})
export class EstablecimientosSaludListaPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaisNoSoportadoPageRoutingModule } from './pais-no-soportado-routing.module';

import { PaisNoSoportadoPage } from './pais-no-soportado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaisNoSoportadoPageRoutingModule
  ],
  declarations: [PaisNoSoportadoPage]
})
export class PaisNoSoportadoPageModule {}

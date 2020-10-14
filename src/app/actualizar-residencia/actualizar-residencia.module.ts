import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActualizarResidenciaPageRoutingModule } from './actualizar-residencia-routing.module';

import { ActualizarResidenciaPage } from './actualizar-residencia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActualizarResidenciaPageRoutingModule
  ],
  declarations: [ActualizarResidenciaPage]
})
export class ActualizarResidenciaPageModule {}

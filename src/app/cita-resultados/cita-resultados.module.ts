import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CitaResultadosPageRoutingModule } from './cita-resultados-routing.module';

import { CitaResultadosPage } from './cita-resultados.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CitaResultadosPageRoutingModule
  ],
  declarations: [CitaResultadosPage]
})
export class CitaResultadosPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistorialCitasPageRoutingModule } from './historial-citas-routing.module';

import { HistorialCitasPage } from './historial-citas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistorialCitasPageRoutingModule
  ],
  declarations: [HistorialCitasPage]
})
export class HistorialCitasPageModule {}

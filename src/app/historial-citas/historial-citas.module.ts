import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistorialCitasPageRoutingModule } from './historial-citas-routing.module';
import { OrderModule } from 'ngx-order-pipe';
import { HistorialCitasPage } from './historial-citas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistorialCitasPageRoutingModule,
    OrderModule
  ],
  declarations: [HistorialCitasPage]
})
export class HistorialCitasPageModule {}

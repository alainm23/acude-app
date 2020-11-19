import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReservaExitosaPageRoutingModule } from './reserva-exitosa-routing.module';

import { ReservaExitosaPage } from './reserva-exitosa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReservaExitosaPageRoutingModule
  ],
  declarations: [ReservaExitosaPage]
})
export class ReservaExitosaPageModule {}

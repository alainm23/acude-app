import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosPeruanoExtrajeroPageRoutingModule } from './datos-peruano-extrajero-routing.module';

import { DatosPeruanoExtrajeroPage } from './datos-peruano-extrajero.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosPeruanoExtrajeroPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [DatosPeruanoExtrajeroPage]
})
export class DatosPeruanoExtrajeroPageModule {}

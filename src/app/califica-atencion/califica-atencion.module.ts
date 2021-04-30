import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalificaAtencionPageRoutingModule } from './califica-atencion-routing.module';

import { CalificaAtencionPage } from './califica-atencion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalificaAtencionPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CalificaAtencionPage]
})
export class CalificaAtencionPageModule {}

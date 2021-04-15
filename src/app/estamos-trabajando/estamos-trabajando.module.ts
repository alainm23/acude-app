import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstamosTrabajandoPageRoutingModule } from './estamos-trabajando-routing.module';

import { EstamosTrabajandoPage } from './estamos-trabajando.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EstamosTrabajandoPageRoutingModule
  ],
  declarations: [EstamosTrabajandoPage]
})
export class EstamosTrabajandoPageModule {}

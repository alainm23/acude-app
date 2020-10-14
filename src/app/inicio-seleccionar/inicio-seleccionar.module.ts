import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InicioSeleccionarPageRoutingModule } from './inicio-seleccionar-routing.module';

import { InicioSeleccionarPage } from './inicio-seleccionar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicioSeleccionarPageRoutingModule
  ],
  declarations: [InicioSeleccionarPage]
})
export class InicioSeleccionarPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CentrosMedicosListaPageRoutingModule } from './centros-medicos-lista-routing.module';

import { CentrosMedicosListaPage } from './centros-medicos-lista.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CentrosMedicosListaPageRoutingModule
  ],
  declarations: [CentrosMedicosListaPage]
})
export class CentrosMedicosListaPageModule {}

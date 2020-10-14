import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PublicidadListaPageRoutingModule } from './publicidad-lista-routing.module';

import { PublicidadListaPage } from './publicidad-lista.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PublicidadListaPageRoutingModule
  ],
  declarations: [PublicidadListaPage]
})
export class PublicidadListaPageModule {}

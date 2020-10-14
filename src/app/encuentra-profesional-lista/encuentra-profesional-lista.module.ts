import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EncuentraProfesionalListaPageRoutingModule } from './encuentra-profesional-lista-routing.module';

import { EncuentraProfesionalListaPage } from './encuentra-profesional-lista.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EncuentraProfesionalListaPageRoutingModule
  ],
  declarations: [EncuentraProfesionalListaPage]
})
export class EncuentraProfesionalListaPageModule {}

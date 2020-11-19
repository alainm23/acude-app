import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalFijarHorariosPageRoutingModule } from './modal-fijar-horarios-routing.module';

import { ModalFijarHorariosPage } from './modal-fijar-horarios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalFijarHorariosPageRoutingModule
  ],
  declarations: [ModalFijarHorariosPage]
})
export class ModalFijarHorariosPageModule {}

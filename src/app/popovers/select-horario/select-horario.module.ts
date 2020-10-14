import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectHorarioPageRoutingModule } from './select-horario-routing.module';

import { SelectHorarioPage } from './select-horario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectHorarioPageRoutingModule
  ],
  declarations: [SelectHorarioPage]
})
export class SelectHorarioPageModule {}

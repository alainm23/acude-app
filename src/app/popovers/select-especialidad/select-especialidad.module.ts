import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectEspecialidadPageRoutingModule } from './select-especialidad-routing.module';

import { SelectEspecialidadPage } from './select-especialidad.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectEspecialidadPageRoutingModule
  ],
  declarations: [SelectEspecialidadPage]
})
export class SelectEspecialidadPageModule {}

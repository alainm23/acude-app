import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EscojeFechaHoraPageRoutingModule } from './escoje-fecha-hora-routing.module';

import { EscojeFechaHoraPage } from './escoje-fecha-hora.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EscojeFechaHoraPageRoutingModule
  ],
  declarations: [EscojeFechaHoraPage]
})
export class EscojeFechaHoraPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectHonorarioPageRoutingModule } from './select-honorario-routing.module';

import { SelectHonorarioPage } from './select-honorario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectHonorarioPageRoutingModule
  ],
  declarations: [SelectHonorarioPage]
})
export class SelectHonorarioPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectIdiomaPageRoutingModule } from './select-idioma-routing.module';

import { SelectIdiomaPage } from './select-idioma.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectIdiomaPageRoutingModule
  ],
  declarations: [SelectIdiomaPage]
})
export class SelectIdiomaPageModule {}

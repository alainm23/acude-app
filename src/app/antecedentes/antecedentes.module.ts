import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AntecedentesPageRoutingModule } from './antecedentes-routing.module';

import { AntecedentesPage } from './antecedentes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AntecedentesPageRoutingModule
  ],
  declarations: [AntecedentesPage]
})
export class AntecedentesPageModule {}

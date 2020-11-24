import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AntecedentesPageRoutingModule } from './antecedentes-routing.module';

import { AntecedentesPage } from './antecedentes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AntecedentesPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AntecedentesPage]
})
export class AntecedentesPageModule {}

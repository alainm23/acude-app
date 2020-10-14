import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectSucursalPageRoutingModule } from './select-sucursal-routing.module';

import { SelectSucursalPage } from './select-sucursal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectSucursalPageRoutingModule
  ],
  declarations: [SelectSucursalPage]
})
export class SelectSucursalPageModule {}

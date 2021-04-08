import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComentariosListaPageRoutingModule } from './comentarios-lista-routing.module';

import { ComentariosListaPage } from './comentarios-lista.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComentariosListaPageRoutingModule
  ],
  declarations: [ComentariosListaPage]
})
export class ComentariosListaPageModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComentariosListaPage } from './comentarios-lista.page';

const routes: Routes = [
  {
    path: '',
    component: ComentariosListaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComentariosListaPageRoutingModule {}

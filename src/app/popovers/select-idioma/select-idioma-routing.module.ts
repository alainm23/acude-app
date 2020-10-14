import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectIdiomaPage } from './select-idioma.page';

const routes: Routes = [
  {
    path: '',
    component: SelectIdiomaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectIdiomaPageRoutingModule {}

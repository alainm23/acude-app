import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatTestPage } from './chat-test.page';

const routes: Routes = [
  {
    path: '',
    component: ChatTestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatTestPageRoutingModule {}

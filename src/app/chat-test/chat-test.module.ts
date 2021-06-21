import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatTestPageRoutingModule } from './chat-test-routing.module';

import { ChatTestPage } from './chat-test.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatTestPageRoutingModule
  ],
  declarations: [ChatTestPage]
})
export class ChatTestPageModule {}

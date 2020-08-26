import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatsListPageRoutingModule } from './chats-list-routing.module';

import { ChatsListPage } from './chats-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatsListPageRoutingModule
  ],
  declarations: [ChatsListPage]
})
export class ChatsListPageModule {}

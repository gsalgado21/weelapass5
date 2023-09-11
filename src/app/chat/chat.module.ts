import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ChatPage } from './chat';
import { ServerSocket } from '../services/server.service';
import { NativeAudio } from '@ionic-native/native-audio';

@NgModule({
  declarations: [
    ChatPage
  ],
  imports: [
    IonicModule,
    CommonModule
  ],
  entryComponents: [
    ChatPage
  ],
  providers: [
    ServerSocket, 
    NativeAudio
  ]
})
export class ChatPageModule { }

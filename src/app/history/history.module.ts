import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HistoryPage } from './history';

@NgModule({
  declarations: [HistoryPage],
  imports: [
    CommonModule,
    IonicModule
  ],
  entryComponents: [HistoryPage],
})
export class HistoryPageModule { }

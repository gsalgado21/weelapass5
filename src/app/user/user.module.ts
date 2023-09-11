import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { UserPage } from './user';
//import { BrMaskerModule } from 'brmasker-ionic-3';

@NgModule({
  declarations: [UserPage],
  imports: [
    CommonModule,
    IonicModule,
    //BrMaskerModule,
  ],
  entryComponents: [UserPage]
})
export class UserPageModule { }


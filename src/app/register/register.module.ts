import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RegisterPage } from './register';
//import { BrMaskerModule } from 'brmasker-ionic-3';

@NgModule({
  declarations: [RegisterPage],
  imports: [
    CommonModule,
    IonicModule,
    //BrMaskerModule
  ],
  entryComponents: [RegisterPage]
})
export class RegisterPageModule { }

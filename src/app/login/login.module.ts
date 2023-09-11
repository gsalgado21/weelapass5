import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { LoginPage } from './login';

@NgModule({
  declarations: [LoginPage],
  imports: [
    CommonModule,
    IonicModule,
  ],
  entryComponents: [LoginPage],
})
export class LoginPageModule { }

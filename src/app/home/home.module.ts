import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';

@NgModule({
  declarations: [HomePage],
  imports: [
    CommonModule,
    IonicModule
  ],
  entryComponents: [HomePage],
  providers: [Diagnostic]
})
export class HomePageModule { }

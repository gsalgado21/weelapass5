import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CarteiraPage } from './carteira';
//import { BrMaskerModule } from 'brmasker-ionic-3';

@NgModule({
  declarations: [
    CarteiraPage,
  ],
  imports: [
    //BrMaskerModule,
    IonicModule,
    CommonModule
  ],
})
export class CarteiraPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PlacesPage } from './places';

@NgModule({
  declarations: [PlacesPage],
  imports: [CommonModule, IonicModule],
  entryComponents: [PlacesPage],
})
export class PlacesPageModule { }

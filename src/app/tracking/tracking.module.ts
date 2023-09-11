import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { TrackingPage } from './tracking';
import { ServerSocket } from '../services/server.service';
import { DriverService } from '../services/driver.service';

@NgModule({
  declarations: [TrackingPage],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: TrackingPage
      }
    ])
  ],
  entryComponents: [TrackingPage],
  providers: [ServerSocket, DriverService]
})
export class TrackingPageModule { }

import { NgModule, LOCALE_ID, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localePtBr from '@angular/common/locales/pt';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { MomentModule } from 'ngx-moment';
import { Camera } from '@ionic-native/camera/ngx';
import { FCM } from '@ionic-native/fcm';
import { Device } from '@ionic-native/device';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { HeaderColor } from '@ionic-native/header-color';
import { AuthService2 } from '../app/services/auth2.service';
import { ApiService } from '../app/services/api.service';
import { HttpService } from '../app/services/http.service';
import { Utils } from '../app/services/utils.service';
import { PlaceService } from '../app/services/place.service';
import { NewContactPage } from '../app/new-contact/new-contact.page';
//import { provideEnvironmentNgxMask, IConfig } from 'ngx-mask';

registerLocaleData(localePtBr);

@NgModule({
  declarations: [AppComponent, NewContactPage],
  entryComponents: [NewContactPage],
  imports: [
    BrowserModule,
    IonicStorageModule.forRoot(),
    HttpClientModule,
    MomentModule,
    //NgxMaskModule.forRoot(),
    IonicModule.forRoot({
      mode: 'md',
      backButtonText: ''
    }),
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    HeaderColor,
    Utils,
    HttpService,
    AuthService2,
    ApiService,
    PlaceService,
    File,
    FileTransfer,
    Camera,
    FCM,
    //provideEnvironmentNgxMask(),
    Device,
    { provide: ErrorHandler, useClass: ErrorHandler },
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

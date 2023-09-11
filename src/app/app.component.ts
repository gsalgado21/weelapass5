import { Component, ViewChild } from '@angular/core';
import { Platform, IonMenu, IonRouterOutlet, MenuController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { HeaderColor } from '@ionic-native/header-color';
import { FCM } from '@ionic-native/fcm';
import { ApiService } from '../app/services/api.service';
import { AuthService2 } from '../app/services/auth2.service';
import { Utils } from '../app/services/utils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  @ViewChild('content', { static: true }) content: IonRouterOutlet;

  rootPage: any = 'SplashPage';
  user = {};

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private api: ApiService,
    private fcm: FCM,
    private authService: AuthService2,
    private headerColor: HeaderColor,
    private utils: Utils,
    private router: Router,
    private menuCtrl: MenuController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.initFCM();

      this.authService.getUser().subscribe(
        (data) => {
          if (data) {
            this.user = data;
            this.menuCtrl.enable(true);
            this.router.navigate(['/home']);
          } else {
            this.menuCtrl.enable(false);
            this.router.navigate(['/login']);
          }
        },
        (err) => {
          console.log(err);
          this.menuCtrl.enable(false);
          this.router.navigate(['/login']);
        }
      );

      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#268790');
      this.headerColor.tint('#268790');
      this.splashScreen.hide();

      this.utils.events.subscribe('menu:user', (user) => {
        this.user = user;
      });
    });
  }

  goTo(page) {
    this.menuCtrl.close().then(() => {
      this.router.navigate([page]);
    });
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.menuCtrl.close().then(() => {
        this.router.navigate(['/login']);
        this.menuCtrl.enable(false);
      });
    });
  }

  private initFCM() {
    if (this.platform.is('cordova')) {
      this.fcm.getToken().then((token) => {
        console.log(token);
        localStorage.setItem('device_token', token);
      });
      this.fcm.onTokenRefresh().subscribe((token) => {
        console.log(token);
        localStorage.setItem('device_token', token);
      });

      this.fcm.onNotification().subscribe((data) => {
        console.log('notificação', data);
        if (data.wasTapped) {
          // Background
          console.log('chegou background');
        } else {
          // Foreground
          console.log('chegou foreground');
        }
      });
    }
  }
}

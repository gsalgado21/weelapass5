import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Utils } from '../services/utils.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-notifications',
  templateUrl: 'notifications.html',
  styleUrls: ['notifications.scss']
})
export class NotificationsPage {

  notifications: Array<any>;
  
  constructor(public navCtrl: NavController, private api: ApiService, private utils: Utils) { }

  ionViewWillEnter() {
    this.utils.showLoading();
    this.api.getNotifications().subscribe(data => {
      if (data && data.result == 'success') {
        this.notifications = data.notifications;
        this.utils.hideLoading();
      } else {
        this.utils.showError();
        this.navCtrl.back();
      }
    }, err => {
      this.utils.showError();
      this.navCtrl.back();
    });
  }

  show(n) {
    this.api.readNotifications(n.id).subscribe(data => {
      console.log(data);
      n.readed_at = new Date();
    });
    const buttons: Array<any> = [{ text: 'Fechar', role: 'cancel' }];
    if (n.url_link) {
      buttons.push({
        text: 'Abrir',
        handler: () => {
          window.open(n.url_link, '_system', 'location=yes');
        }
      });
    }
    this.utils.showAlert(n.title, n.content, buttons, false);
  }
}

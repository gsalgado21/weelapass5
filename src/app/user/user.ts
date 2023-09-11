import { Component } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { AuthService2 } from "../services/auth2.service";
import { Utils } from '../services/utils.service';
import { ApiService } from '../services/api.service';


@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
  styleUrls: ['user.scss']
})
export class UserPage {
  user: any = {};

  constructor(
    private nav: NavController,
    private authService: AuthService2,
    private platform: Platform,
    private utils: Utils,
    private api: ApiService
  ) {}

  save() {
    this.nav.pop();
  }

  ionViewWillEnter() {
    this.utils.showLoading();
    this.authService.getUser().subscribe(data => {
      this.user = data;
      this.utils.hideLoading();
    });
  }

  async selectImage() {
    try {
      const path = await this.utils.showPictureOptions(400, 400) as string;
      this.user.avatar = path;
    } catch (error) {
      console.error(error);
    }
  }

  confirm() {
    this.utils.showLoading();
    if (this.user.avatar.indexOf('http') === -1) {
      this.api.uploadImageToUsers(this.user.avatar, { attribute: 'avatar' }).subscribe((data) => {
        console.log(data);
      });
    }
    this.api.updateUser({ user: this.user }).subscribe(data => {
      this.utils.hideLoading();
      if (data && data.result === 'success') {
        this.nav.navigateRoot(['/']);
        this.utils.showToast('Dados Atualizados com sucesso!');
        this.utils.events.publish('menu:user', this.user);
      }
    }, err => { this.utils.hideLoading() })
  }
}

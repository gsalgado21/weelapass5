import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Utils } from '../services/utils.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: 'contact-us.html',
  styleUrls: ['contact-us.scss'],
})
export class ContactUsPage {
  issue: any = {};

  constructor(private navCtrl: NavController, private utils: Utils, private api: ApiService) {}

  ionViewDidEnter() {}

  async selectImage() {
    try {
      const path = (await this.utils.showPictureOptions(800, 800)) as string;
      this.issue['image'] = path;
    } catch (error) {
      console.error(error);
    }
  }

  async confirm() {
    this.utils.showLoading('Enviando dados...');
    try {
      const data = await this.api.createIssue({ issue: this.issue }).toPromise();
      if (data && data['result'] == 'success') {
        if (this.issue.image) {
          await this.api.uploadImageToIssue(this.issue.image, { id: data.issue_id }).toPromise();
        }
        this.utils.hideLoading();
        this.utils.showAlert('Dados enviados com sucesso!', null, [{ text: 'Ok', handler: () => this.navCtrl.navigateRoot(['/']) }], false);
      } else {
        this.utils.hideLoading();
        this.utils.showError();
      }
    } catch (err) {
      console.error(err);
      this.utils.hideLoading();
      this.utils.showError();
    }
  }
}

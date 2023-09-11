import { Component } from '@angular/core';
import { NavController, MenuController } from '@ionic/angular';
import { Utils } from "../services/utils.service";
import { AuthService2 } from "../services/auth2.service";
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.html',
  styleUrls: ['login.scss']
})
export class LoginPage {
  user: any = {};

  constructor(public nav: NavController, private menu: MenuController, public authService: AuthService2, private utils: Utils, private api: ApiService) { }

  async signin() {
    this.utils.showLoading('Autenticando..');
    try {
      const data = await this.authService.login({ email: this.user.email, password: this.user.password }).toPromise();
      this.utils.hideLoading();
      
      if (data && data.result == 'success') {
        this.nav.navigateRoot('/home');
        this.menu.enable(true);
        
        try {
          const user = await this.authService.getUser().toPromise();
          this.utils.events.publish('menu:user', user);
        } catch (error) {
          console.error(error);
        }
      } else {
        this.utils.showAlert(null, 'Usuário e/ou senha inválidos', [{ text: 'Ok', role: 'cancel' }], false);
      }
    } catch (error) {
      this.utils.showError(error.message);
    }
  }

  async reset() {
    if (!this.user.email) {
      this.utils.showAlert('Email Inválido', 'Informe o email no campo de login', [], true);
    } else {
      try {
        const data = await this.api.forgetPassword(this.user.email).toPromise();

        if (data && data.result == 'success') {
          this.utils.showAlert('Email de Redefinição Enviado', 'Verifique sua caixa de entrada', [{ text: 'Ok', role: 'cancel' }], false);
        } else {
          this.utils.showAlert('Email Inválido', 'O email informado não consta na base de dados', [], true);
        }
      } catch (error) {
        this.utils.showAlert('Email Inválido', 'O email informado não consta na base de dados', [], true);
      }
    }
  }
}

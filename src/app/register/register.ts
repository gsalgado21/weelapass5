import { Component } from '@angular/core';
import { AuthService2 } from '../services/auth2.service';
import { ApiService } from '../services/api.service';
import { Utils } from '../services/utils.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: 'register.html',
  styleUrls: ['register.scss']
})
export class RegisterPage {
  user: any = {};

  constructor(
    public authService: AuthService2,
    public utils: Utils,
    private api: ApiService,
    private nav: NavController
  ) {}

  async signup() {
    try {
      const isValid = await this.checkInfo();
      if (isValid) {
        this.utils.showLoading();
        const data = await this.authService.create({ user: this.user }).toPromise();
        if (data && data.result == 'success') {
          if (this.user.image_path) {
            try {
              await this.api.uploadImageToUsers(this.user.image_path, { attribute: 'avatar' }).toPromise();
            } catch (err) {
              this.utils.hideLoading();
              this.utils.showError();
              return;
            }
          }
          this.utils.hideLoading();
          this.utils.events.publish('menu:user', this.user);
          this.utils.showAlert(
            'Seja Bem-Vindo ao Weela',
            '',
            [{ text: 'Vamos lá!', handler: () => { this.nav.navigateRoot('HomePage'); } }],
            false
          );
        } else {
          this.utils.hideLoading();
          this.utils.showError();
        }
      }
    } catch (error) {
      this.utils.hideLoading();
      this.utils.showAlert('Erro', error.message, ['OK'], false);
    }
  }

  async selectImage() {
    try {
      const path = await this.utils.showPictureOptions(400, 400) as string;
      this.user.image_path = path;
    } catch (error) {
      console.error(error);
    }
  }

  async checkInfo() {
    try {
      if (!this.isCPFValid(this.user.federal_tax_id.replace(/[^0-9]/g, ''))) {
        throw new Error('CPF inválido');
      } else if (!this.validateEmail(this.user.email)) {
        throw new Error('Email inválido');
      } else {
        const data = await this.api.checkEmail(this.user.email).toPromise();
        if (data && typeof data['result'] != 'undefined' && data.result == 'success') {
          const data2 = await this.api.checkFederalTaxId(this.user.federal_tax_id).toPromise();
          if (data2 && typeof data2['result'] != 'undefined' && data2.result == 'success') {
            return true;
          } else {
            throw new Error('CPF já existe na nossa base de dados');
          }
        } else {
          throw new Error('Email já existe na nossa base de dados');
        }
      }
    } catch (error) {
      throw error;
    }
  }

  private isCPFValid(cpf: string): boolean {
    if (cpf == null) {
      return false;
    }
    if (cpf.length != 11) {
      return false;
    }
    if ((cpf == '00000000000') || (cpf == '11111111111') || (cpf == '22222222222') || (cpf == '33333333333') || (cpf == '44444444444') || (cpf == '55555555555') || (cpf == '66666666666') || (cpf == '77777777777') || (cpf == '88888888888') || (cpf == '99999999999')) {
      return false;
    }
    let numero: number = 0;
    let caracter: string = '';
    let numeros: string = '0123456789';
    let j: number = 10;
    let somatorio: number = 0;
    let resto: number = 0;
    let digito1: number = 0;
    let digito2: number = 0;
    let cpfAux: string = '';
    cpfAux = cpf.substring(0, 9);
    for (let i: number = 0; i < 9; i++) {
      caracter = cpfAux.charAt(i);
      if (numeros.search(caracter) == -1) {
        return false;
      }
      numero = Number(caracter);
      somatorio = somatorio + (numero * j);
      j--;
    }
    resto = somatorio % 11;
    digito1 = 11 - resto;
    if (digito1 > 9) {
      digito1 = 0;
    }
    j = 11;
    somatorio = 0;
    cpfAux = cpfAux + digito1;
    for (let i: number = 0; i < 10; i++) {
      caracter = cpfAux.charAt(i);
      numero = Number(caracter);
      somatorio = somatorio + (numero * j);
      j--;
    }
    resto = somatorio % 11;
    digito2 = 11 - resto;
    if (digito2 > 9) {
      digito2 = 0;
    }
    cpfAux = cpfAux + digito2;
    if (cpf != cpfAux) {
      return false;
    }
    else {
      return true;
    }
  }

  private validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
}
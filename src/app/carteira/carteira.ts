import { Component, NgZone } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
//import { PerfilPage } from '../perfil/perfil';
import { UserPage } from '../user/user';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-carteira',
  templateUrl: 'carteira.html',
  styleUrls: ['carteira.scss'],
})
export class CarteiraPage {

  tab = "extrato";
  nota: number = 5;
  extrato = [];
  wallet: any;
  show = false;
  valores = [
    {
      value: 5,
      active: false
    },
    // {
    //   value: 10,
    //   active: false
    // },
    {
      value: 20,
      active: false
    },
    {
      value: 50,
      active: false
    },
    // {
    //   value: 100,
    //   active: false
    // },
    // {
    //   value: 150,
    //   active: false
    // }
  ];
  btnStart = false;
  addCard = false;
  card = {
    nomt: "",
    nmr: '',
    vldd: '',
    cdsg: ''
  };
  cards = [];
  transtant: any;
  flag: any;
  valormodal = null;
  outroValorI = null;
  cartao_valido: boolean = null;

  emitEvent = new EventEmitter<any>();

  constructor(
    private loadingCtrl: LoadingController,
    private ngZone: NgZone,
    public modal: ModalController,
    private toastCtrl: ToastController, 
    private api: ApiService
  ) {
    //this.init();
  }

  ionViewWillEnter() {
    this.init();
  }

  init() {
    this.emitEvent.emit("Carteira digital");
    // O código que estava no método init() anteriormente deve ser movido aqui
  }

  // Resto do código permanece igual

  // ...
}

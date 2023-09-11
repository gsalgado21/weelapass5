import { Injectable, ViewChild, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { LoadingController, AlertController, ToastController, PopoverController, ModalController, Platform, ActionSheetController } from '@ionic/angular';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class Utils {

  loading: HTMLIonLoadingElement;
  public today: string = new Date().toISOString();

  public pictureUploaded: EventEmitter<string> = new EventEmitter<string>();
  events: any;

  constructor(private loadingCtrl: LoadingController, private popoverCtrl: PopoverController,
    private alertCtrl: AlertController, public toastCtrl: ToastController,
    public modalCtrl: ModalController, public platform: Platform,
    public actionCtrl: ActionSheetController, private camera: Camera) {
  }

  async showLoading(text?: string): Promise<void> {
    if (this.loading) await this.loading.dismiss();
    
    this.loading = await this.loadingCtrl.create({
      message: text || 'Carregando...',
    });

    await this.loading.present();
  }

  async hideLoading(): Promise<void> {
    if (this.loading) await this.loading.dismiss();
  }

  async showError(text?: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Falha na execução',
      subHeader: text || 'Ops! Algo não saiu como o esperado',
      buttons: ['Fechar'],
    });

    await alert.present();
    await this.hideLoading();
  }

  async showToast(text: string): Promise<HTMLIonToastElement> {
    const toast = await this.toastCtrl.create({
      message: text,
      duration: 2000,
    });

    await toast.present();
    return toast;
  }

  async showModal(page, params): Promise<HTMLIonModalElement> {
    const modal = await this.modalCtrl.create({
      component: page,
      componentProps: params,
    });

    await modal.present();
    return modal;
  }

  async showPopover(page, ev, params): Promise<HTMLIonPopoverElement> {
    const popover = await this.popoverCtrl.create({
      component: page,
      componentProps: params,
      event: ev,
      translucent: true,
    });

    await popover.present();
    return popover;
  }

  async showAlert(title: string, text: string, buttons: any[], with_cancel: boolean, inputs?): Promise<void> {
    const alertButtons = [];

  if (with_cancel) {
    alertButtons.push({
      text: 'Cancelar',
      role: 'cancel'
    });
  }

  buttons.forEach(btn => {
    alertButtons.push({
      text: btn.text,
      handler: btn.handler // Se você precisar de algum manipulador específico para o botão
    });
  });

  const alert = await this.alertCtrl.create({
    header: title,
    subHeader: text,
    inputs: inputs,
    backdropDismiss: false,
    buttons: alertButtons // Use o array de botões aqui
  });

  await alert.present();
}

  async showPictureOptions(width, height, source?) {
    let self = this;
    let cameraOptions: CameraOptions = {
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      allowEdit: true,
      targetWidth: width,
      targetHeight: height,
      quality: 80,
    };
    let galleryOptions: CameraOptions = {
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      allowEdit: true,
      targetWidth: width,
      targetHeight: height,
      quality: 100
    };
    return Observable.create(async observer => {
      if (!source) {
        let actionSheet = await self.actionCtrl.create({
          header: 'Selecione a origem',
          buttons: [{
            text: 'Câmera',
            icon: 'camera',
            handler: () => {
              this.camera.getPicture(cameraOptions).then((imageData) => {
                observer.next(imageData);
                observer.complete();
              }).catch((error) => {
                observer.next(null);
                observer.complete();
              });
            }
          }, {
            text: 'Galeria',
            icon: 'images',
            handler: () => {
              this.camera.getPicture(galleryOptions).then((imageData) => {
                observer.next(imageData);
                observer.complete();
              }).catch((error) => {
                observer.next(null);
                observer.complete();
              });
            }
          }]
        });
        await actionSheet.present();
      } else if (source == 'gallery') {
        this.camera.getPicture(galleryOptions).then((imageData) => {
          observer.next(imageData);
          observer.complete();
        }).catch((error) => {
          observer.next(null);
          observer.complete();
        });
      } else {
        this.camera.getPicture(cameraOptions).then((imageData) => {
          observer.next(imageData);
          observer.complete();
        }).catch((error) => {
          observer.next(null);
          observer.complete();
        });
      }
    });
  }
}
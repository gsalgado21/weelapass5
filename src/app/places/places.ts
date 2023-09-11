import { Component, ViewChild } from '@angular/core';
import { IonSearchbar, ModalController, NavParams, NavController, Platform } from '@ionic/angular';
import { PlaceService } from '../services/place.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Utils } from "../services/utils.service";

@Component({
  selector: 'app-places',
  templateUrl: 'places.html',
  styleUrls: ['places.scss']
})
export class PlacesPage {
  places: any = [];
  keyword = '';
  lat: number;
  lon: number;
  pageLoaded = false;
  type: any;
  @ViewChild('searchbar', { static: false }) searchbar: IonSearchbar;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public placeService: PlaceService,
    public geolocation: Geolocation,
    private utils: Utils,
    public navParams: NavParams,
    public platform: Platform
  ) {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.lat = resp.coords.latitude;
      this.lon = resp.coords.longitude;
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  ionViewDidEnter() {
    this.pageLoaded = true;
    setTimeout(() => {
      this.searchbar.setFocus();
    }, 300);
  }

  ionViewWillLeave() {
    this.pageLoaded = false;
  }

  ionViewWillEnter() {
    this.searchbar.setFocus();
    this.type = this.navParams.get('type');
  }

  selectPlace(place) {
    let attr = this.type;
    let obj = {};
    obj[attr + '_latitude'] = place.geometry.location.lat;
    obj[attr + '_longitude'] = place.geometry.location.lng;
    obj[attr + '_vicinity'] = place.formatted_address;
    this.modalCtrl.dismiss(obj);
  }

  clear() {
    this.keyword = '';
    this.search();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  // search by address
  search() {
    if (this.keyword && this.keyword.length > 0) {
      this.placeService.searchByAddress(this.keyword, this.lat, this.lon).subscribe(result => {
        this.places = result.results;
        this['loader'] = false;
      }, err => {
        this.utils.showError();
        this['loader'] = false;
      });
    } else {
      this.places = [];
      this['loader'] = false;
    }
  }

  calcDistance(place) {
    return this.placeService.calcCrow(place.geometry.location.lat, place.geometry.location.lng, this.lat, this.lon).toFixed(1);
  }

  async openMap() {
    const modal = await this.modalCtrl.create({
      component: 'MapPage',
      componentProps: { type: this.type }
    });

    modal.present();
    modal.onWillDismiss().then(data => {
      if (data && data.data) {
        this.modalCtrl.dismiss(data.data);
      }
    });
  }
}
